import { useState, useEffect, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
	useChecksQuery,
	submitCheckResults,
	prepareCheckResultsPayload,
} from '../api';
import { Button } from 'semantic-ui-react';
import updateChecks, {
	ExtendedCheck,
	areChecksReadyToBeSubmitted,
	CheckResultEnum,
} from './updateChecks';
import * as Styled from './styled';
import useAnsweringCheckWithKeyPress from './useAnsweringCheckWithKeyPress';
import { Confetti } from '../components/Confetti';

export default function AnsweringChecksForm() {
	const { isLoading, data: initialChecks, error } = useChecksQuery();
	const [checks, setChecks] = useState<ExtendedCheck[]>([]);

	const {
		mutate: saveCheckResults,
		isError: savingResultsHasError,
		isSuccess: savingResultsSucceeded,
		isLoading: savingResultsLoading,
		reset,
	} = useMutation({
		mutationFn: (checkResults: ExtendedCheck[]) => {
			return submitCheckResults(prepareCheckResultsPayload(checkResults));
		},
		onSuccess: () => setChecks(initialChecks!),
	});

	const { cursor, handleOnMouseEnter, handleOnMouseLeave } =
		useAnsweringCheckWithKeyPress({ checks, initialChecks, setChecks });

	// initialize data
	useEffect(() => {
		if (initialChecks) {
			setChecks(initialChecks);
		}
	}, [initialChecks]);

	const canSubmit = useMemo(() => {
		return areChecksReadyToBeSubmitted(checks);
	}, [checks]);

	const handleUserChoice = (
		checkId: ExtendedCheck['checkId'],
		response: ExtendedCheck['result']
	) => {
		setChecks(prev => updateChecks(prev, checkId, response));
	};

	const handleSubmitCheckResults = (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		saveCheckResults(checks);
	};

	// rendering

	if (isLoading || !initialChecks)
		return <Styled.Container>Loading...</Styled.Container>;

	if (error) {
		return (
			<Styled.Container>
				<Styled.ErrorMessage>An error has occurred</Styled.ErrorMessage>
			</Styled.Container>
		);
	}

	if (savingResultsSucceeded) {
		return (
			<>
				<Styled.ChecksSubmitSuccess>
					<p>Answers are submitted successfully !</p>
					<div>
						<Button onClick={() => reset()}>Go Back </Button>
					</div>
				</Styled.ChecksSubmitSuccess>
				<Confetti />
			</>
		);
	}

	return (
		<Styled.Container>
			<form onSubmit={handleSubmitCheckResults}>
				{checks?.map((check, idx) => (
					<Styled.CheckContainer
						$active={cursor === idx && check.enabled}
						$enabled={check.enabled}
						key={check.checkId}
						onMouseEnter={() => handleOnMouseEnter(check)}
						onMouseLeave={() => handleOnMouseLeave()}>
						<p>{check.description}</p>
						<Button.Group>
							<Button
								basic={check.result !== CheckResultEnum.Yes}
								color='black'
								disabled={!check.enabled}
								type='button'
								onClick={() =>
									handleUserChoice(
										check.checkId,
										CheckResultEnum.Yes
									)
								}>
								Yes
							</Button>
							<Button
								basic={check.result !== CheckResultEnum.No}
								color='black'
								disabled={!check.enabled}
								type='button'
								onClick={() =>
									handleUserChoice(
										check.checkId,
										CheckResultEnum.No
									)
								}>
								No
							</Button>
						</Button.Group>
					</Styled.CheckContainer>
				))}
				<Styled.FormFooter>
					{savingResultsHasError && (
						<Styled.ErrorMessage>
							&#9888; Error has occurred, please try again !
						</Styled.ErrorMessage>
					)}
					<Button
						loading={savingResultsLoading}
						disabled={!canSubmit || savingResultsLoading}>
						Submit
					</Button>
				</Styled.FormFooter>
			</form>
		</Styled.Container>
	);
}
