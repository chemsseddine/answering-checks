import updateChecks, {
	sortAndInitializeChecks,
	areChecksReadyToBeSubmitted,
} from '../AnsweringChecks/updateChecks';

const checks = [
	{ id: '2', priority: 6, description: 'some desc' },
	{ id: '3', priority: 16, description: 'some desc' },
	{ id: '1', priority: 3, description: 'some desc' },
];
const data = sortAndInitializeChecks(checks);

describe('updateChecks', () => {
	test('transform server response to sorted list with initial values', () => {
		expect(data).toEqual([
			{
				checkId: '1',
				enabled: true,
				result: undefined,
				priority: 3,
				description: 'some desc',
			},
			{
				checkId: '2',
				enabled: false,
				result: undefined,
				priority: 6,
				description: 'some desc',
			},
			{
				checkId: '3',
				enabled: false,
				result: undefined,
				priority: 16,
				description: 'some desc',
			},
		]);
	});

	test('should update result value properly', () => {
		const checkId = '1';
		const nextState = updateChecks(data, checkId, 'yes');
		const check = nextState.find(ch => ch.checkId === checkId);
		expect(check?.result).toBe('yes');
	});

	test('should enable next check if current response is yes', () => {
		const checkId = '1';
		const nextState = updateChecks(data, checkId, 'yes');
		const checkIdx = nextState.findIndex(ch => ch.checkId === checkId);
		expect(nextState[checkIdx + 1].enabled).toBeTruthy();
	});

	test('should disable next check if response is no', () => {
		const checkId = '1';
		const nextState = updateChecks(data, checkId, 'no');
		const checkIdx = nextState.findIndex(ch => ch.checkId === checkId);
		expect(nextState[checkIdx + 1].enabled).toBeFalsy();
	});

	test('should disable all next checks if response is no', () => {
		const checkId = '1';
		const nextState_1 = updateChecks(data, checkId, 'yes');
		const nextState_2 = updateChecks(nextState_1, '2', 'yes');
		const nextState_3 = updateChecks(nextState_2, '3', 'yes');
		const nextState_4 = updateChecks(nextState_3, checkId, 'no');

		const checkIdx = nextState_4.findIndex(ch => ch.checkId === checkId);

		nextState_4.forEach((ch, idx) => {
			if (idx > checkIdx) {
				expect(ch.enabled).toBeFalsy();
			}
		});
	});
});

describe('areChecksReadyToBeSubmitted', () => {
	test('should return false => initial checks are not ready for submission', () => {
		expect(areChecksReadyToBeSubmitted(data)).toBe(false);
	});

	test('should return false => checks are not ready to be submitted if not answered as yes', () => {
		const nextChecksState_1 = updateChecks(data, '1', 'yes');
		const nextChecksState_2 = updateChecks(nextChecksState_1, '2', 'yes');
		expect(areChecksReadyToBeSubmitted(nextChecksState_2)).toBe(false);
	});

	test('should return true => checks are ready to be submitted when all response are anwsered Yes', () => {
		const nextChecksState_1 = updateChecks(data, '1', 'yes');
		const nextChecksState_2 = updateChecks(nextChecksState_1, '2', 'yes');
		const nextChecksState_3 = updateChecks(nextChecksState_2, '3', 'yes');
		expect(areChecksReadyToBeSubmitted(nextChecksState_3)).toBe(true);
	});
	test('should return true => checks are ready to be submitted when at least there is No response', () => {
		const nextChecksStateWithAnswerNo = updateChecks(data, '1', 'no');
		expect(areChecksReadyToBeSubmitted(nextChecksStateWithAnswerNo)).toBe(
			true
		);
	});
});
