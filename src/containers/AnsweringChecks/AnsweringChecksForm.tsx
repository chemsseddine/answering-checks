import { useState, useEffect, useMemo } from 'react';
import { useSubmitCheckResult, useChecksQuery } from '../../api';
import { Button } from 'semantic-ui-react';
import styled, { css } from 'styled-components';
import updateChecks, {
	ExtendedCheck,
	areChecksReadyToBeSubmitted,
} from './updateChecks';
import useKeyPress from '../../useKeyPress';

const CheckContainer = styled.div<{ $active: boolean }>`
	max-width: 400px;
	padding: 10px 30px;
	${props =>
		props.$active &&
		css`
			background: ${({ theme }) => theme.highlight};
			&:hover {
				background: ${({ theme }) => theme.highlight};
			}
		`};
`;

const FormFooter = styled.div`
	padding: 10px 0;
	display: flex;
	flex-direction: row-reverse;
`;

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
`;

export default function ChecksForm() {
	const { isLoading, data, error } = useChecksQuery();

	const mutation = useSubmitCheckResult();

	const [checks, setChecks] = useState<ExtendedCheck[]>([]);

	// handling key presses
	const downPress = useKeyPress('ArrowDown');
	const upPress = useKeyPress('ArrowUp');
	const onePress = useKeyPress('1');
	const twoPress = useKeyPress('2');
	const [cursor, setCursor] = useState(0);
	const [hovered, setHovered] = useState<
		ExtendedCheck['checkId'] | undefined
	>(undefined);

	useEffect(() => {
		if (checks?.length && downPress) {
			if (cursor < checks.length - 1 && checks[cursor + 1].enabled) {
				setCursor(p => (p < checks.length - 1 ? p + 1 : p));
			}
		}
	}, [downPress, checks]);

	useEffect(() => {
		if (data?.length && twoPress) {
			const cid = data[cursor].checkId;

			setChecks(prev => updateChecks(prev, cid, 'no'));
		}
	}, [twoPress, data]);

	useEffect(() => {
		if (data?.length && onePress) {
			const cid = data[cursor].checkId;

			setChecks(prev => updateChecks(prev, cid, 'yes'));
		}
	}, [onePress, data]);

	useEffect(() => {
		if (data?.length && upPress) {
			setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
		}
	}, [upPress, data]);

	useEffect(() => {
		if (data?.length && hovered) {
			setCursor(checks.findIndex(c => c.checkId === hovered));
		}
	}, [hovered, data]);

	// finish key presses

	// initialize data
	useEffect(() => {
		if (data) {
			setChecks(data);
		}
	}, [data]);

	const canSubmit = useMemo(() => {
		return areChecksReadyToBeSubmitted(checks);
	}, [checks]);

	const handleUserChoice = (
		checkId: ExtendedCheck['checkId'],
		response: ExtendedCheck['result']
	) => {
		setChecks(prev => updateChecks(prev, checkId, response));
	};

	const handleOnMouseEnter = (check: ExtendedCheck) => {
		if (check.enabled) {
			setHovered(check.checkId);
		}
	};

	const submitResult = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		mutation.mutate(checks);
	};

	// rendering

	if (isLoading || !data) return <Container>Loading...</Container>;

	if (error || mutation.isError) {
		return <Container>An error has occurred</Container>;
	}

	if (mutation.isSuccess) {
		return <Container>Answers are submitted successfully !</Container>;
	}

	return (
		<Container>
			<form onSubmit={submitResult}>
				{checks?.map((check, idx) => (
					<CheckContainer
						$active={cursor === idx && check.enabled}
						key={check.checkId}
						onMouseEnter={() => handleOnMouseEnter(check)}
						onMouseLeave={() => setHovered(undefined)}>
						<p>{check.description}</p>
						<Button.Group>
							<Button
								basic={check.result !== 'yes'}
								color='black'
								disabled={!check.enabled}
								type='button'
								onClick={() =>
									handleUserChoice(check.checkId, 'yes')
								}>
								Yes
							</Button>
							<Button
								basic={check.result !== 'no'}
								color='black'
								disabled={!check.enabled}
								type='button'
								onClick={() =>
									handleUserChoice(check.checkId, 'no')
								}>
								No
							</Button>
						</Button.Group>
					</CheckContainer>
				))}
				<FormFooter>
					<Button
						loading={mutation.isLoading}
						disabled={!canSubmit || mutation.isLoading}>
						Submit
					</Button>
				</FormFooter>
			</form>
		</Container>
	);
}
