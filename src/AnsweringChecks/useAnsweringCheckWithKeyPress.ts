import { useState, useEffect, useCallback, useMemo } from 'react';
import useKeyPress from '../hooks/useKeyPress';
import updateChecks, { ExtendedCheck, CheckResultEnum } from './updateChecks';

enum KeyboardShortcut {
	Keydown = 'ArrowDown',
	KeyUp = 'ArrowUp',
	KeyOne = '1',
	KeyTwo = '2',
}

interface UseAnsweringCheckWithKeyPress {
	checks: ExtendedCheck[];
	setChecks: React.Dispatch<React.SetStateAction<ExtendedCheck[]>>;
	initialChecks: ExtendedCheck[] | undefined;
}

export default function useAnsweringCheckWithKeyPress({
	checks,
	setChecks,
	initialChecks,
}: UseAnsweringCheckWithKeyPress) {
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

	const handleOnMouseEnter = (check: ExtendedCheck) => {
		if (check.enabled) {
			setHovered(check.checkId);
		}
	};

	const handleOnMouseLeave = () => {
		setHovered(undefined);
	};

	return {
		cursor,
		handleOnMouseEnter,
		handleOnMouseLeave,
	};
}
