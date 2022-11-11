import { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import { useSubmitCheckResult, useChecksQuery } from '../../api';
import { Button } from 'semantic-ui-react';
import styled, { css } from 'styled-components';
import updateChecks, {
	ExtendedCheck,
	areChecksReadyToBeSubmitted,
	CheckResultEnum,
} from './updateChecks';
import useKeyPress from '../../useKeyPress';

enum KeyboardShortcut {
	Keydown = 'ArrowDown',
	KeyUp = 'ArrowUp',
	KeyOne = '1',
	KeyTwo = '2',
}

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

export default function AnsweringChecksForm() {
	const { isLoading, data: initialChecks, error } = useChecksQuery();
	const mutation = useSubmitCheckResult();
	const [checks, setChecks] = useState<ExtendedCheck[]>([]);

	// handling key presses
	const downPress = useKeyPress(KeyboardShortcut.Keydown);
	const upPress = useKeyPress(KeyboardShortcut.KeyUp);
	const onePress = useKeyPress(KeyboardShortcut.KeyOne);
	const twoPress = useKeyPress(KeyboardShortcut.KeyTwo);
	const [cursor, setCursor] = useState(0);
	const [hovered, setHovered] = useState<
		ExtendedCheck['checkId'] | undefined
	>(undefined);

	const hoveredCheckId = useMemo(() => {
		if (initialChecks?.length) {
			return initialChecks[cursor].checkId;
		}
	}, [cursor, initialChecks]);

	const updateHoveredCheckWithResponse = useCallback(
		(response: ExtendedCheck['result']) => {
			if (hoveredCheckId) {
				setChecks(prev => updateChecks(prev, hoveredCheckId, response));
			}
		},
		[hoveredCheckId]
	);

	useEffect(() => {
		if (initialChecks?.length) {
			if (downPress) {
				const canCheckBeSelected = cursor < initialChecks.length - 1;
				const isNextCheckEnabled = checks[cursor + 1].enabled;
				if (canCheckBeSelected && isNextCheckEnabled) {
					setCursor(p => (p < checks.length - 1 ? p + 1 : p));
				}
			}

			if (upPress) {
				setCursor(prevState =>
					prevState > 0 ? prevState - 1 : prevState
				);
			}
		}
	}, [downPress, upPress, checks]);

	useEffect(() => {
		if (onePress) {
			updateHoveredCheckWithResponse(CheckResultEnum.Yes);
		}

		if (twoPress) {
			updateHoveredCheckWithResponse(CheckResultEnum.No);
		}
	}, [onePress, twoPress]);

	useEffect(() => {
		if (initialChecks?.length && hovered) {
			setCursor(checks.findIndex(c => c.checkId === hovered));
		}
	}, [hovered, initialChecks]);

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

	const handleOnMouseEnter = (check: ExtendedCheck) => {
		if (check.enabled) {
			setHovered(check.checkId);
		}
	};

	const handleSubmitCheckResults = (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		mutation.mutate(checks);
	};

	// rendering

	if (isLoading || !initialChecks) return <Container>Loading...</Container>;

	if (error || mutation.isError) {
		return <Container>An error has occurred</Container>;
	}

	if (mutation.isSuccess) {
		return <Container>Answers are submitted successfully !</Container>;
	}

	return (
		<Container>
			<form onSubmit={handleSubmitCheckResults}>
				{checks?.map((check, idx) => (
					<CheckContainer
						$active={cursor === idx && check.enabled}
						key={check.checkId}
						onMouseEnter={() => handleOnMouseEnter(check)}
						onMouseLeave={() => setHovered(undefined)}>
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
