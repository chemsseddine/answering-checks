import updateChecks, {
	sortAndInitializeChecks,
	areChecksReadyToBeSubmitted,
} from '../containers/AnsweringChecks/updateChecks';

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
	test('shouchld return checks ready', () => {
		expect(areChecksReadyToBeSubmitted(data)).toBe(false);
		const nextChecksState = updateChecks(data, '1', 'yes');
		expect(areChecksReadyToBeSubmitted(nextChecksState)).toBe(false);
		const nextChecksStateWithAnswerNo = updateChecks(data, '1', 'no');
		expect(areChecksReadyToBeSubmitted(nextChecksStateWithAnswerNo)).toBe(
			true
		);
	});
});
