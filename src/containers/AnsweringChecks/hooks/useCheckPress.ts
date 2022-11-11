import { useState, useEffect } from 'react';
import useKeyPress from '../../../useKeyPress';
import updateChecks, { ExtendedCheck } from '../updateChecks';

export default function useCheckPress(
	checks: ExtendedCheck[],
	update: React.Dispatch<React.SetStateAction<ExtendedCheck[]>>
) {
	const downPress = useKeyPress('ArrowDown');
	const upPress = useKeyPress('ArrowUp');
	const onePress = useKeyPress('1');
	const twoPress = useKeyPress('2');
	const [cursor, setCursor] = useState(0);
	const [hovered, setHovered] = useState<any>(undefined);

	useEffect(() => {
		if (checks?.length && downPress) {
			if (cursor < checks.length - 1 && checks[cursor + 1].enabled) {
				setCursor(p => (p < checks.length - 1 ? p + 1 : p));
			}
		}
	}, [downPress, checks]);

	useEffect(() => {
		if (checks?.length && twoPress) {
			const cid = checks[cursor].checkId;

			update(prev => updateChecks(prev, cid, 'no'));
		}
	}, [twoPress, checks]);

	useEffect(() => {
		if (checks?.length && onePress) {
			const cid = checks[cursor].checkId;

			update(prev => updateChecks(prev, cid, 'yes'));
		}
	}, [onePress, checks]);

	useEffect(() => {
		if (checks?.length && upPress) {
			setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
		}
	}, [upPress, checks]);

	useEffect(() => {
		if (checks?.length && hovered) {
			setCursor(checks.findIndex(c => c.checkId === hovered));
		}
	}, [hovered, checks]);

	return {
		setHovered,
		cursor,
	};
}
