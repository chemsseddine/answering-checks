export interface Check {
	id: string;
	priority: number;
	description: string;
}

export type ExtendedCheckResult = 'yes' | 'no' | undefined;

export enum CheckResultEnum {
	Yes = 'yes',
	No = 'no',
}

export interface ExtendedCheck {
	checkId: Check['id'];
	description: Check['description'];
	priority: Check['priority'];
	result: ExtendedCheckResult;
	enabled: boolean;
}

export function sortAndInitializeChecks(list: Check[]): ExtendedCheck[] {
	return [...list]
		.sort((a, b) => a.priority - b.priority)
		.map((check, idx) => ({
			checkId: check.id,
			result: undefined,
			enabled: idx === 0,
			description: check.description,
			priority: check.priority,
		}));
}

// sorted list

export default function updateChecks(
	checkList: ExtendedCheck[],
	checkId: ExtendedCheck['checkId'],
	userChoice: ExtendedCheck['result']
): ExtendedCheck[] {
	const currentCheckIndex = checkList.findIndex(ch => ch.checkId === checkId);

	const draftCheckList = checkList.map(ch => ({ ...ch }));

	// save user choice
	draftCheckList[currentCheckIndex].result = userChoice;

	// if last check , return
	if (currentCheckIndex + 1 === checkList.length) {
		return draftCheckList;
	}

	draftCheckList.forEach((check, idx) => {
		if (idx <= currentCheckIndex) return;

		if (userChoice === CheckResultEnum.No) {
			return (check.enabled = false);
		}

		const isNextCheckIndex = idx === currentCheckIndex + 1;
		const previousCheck = draftCheckList[idx - 1];
		const isPrevCheckAccepted =
			previousCheck.result === CheckResultEnum.Yes &&
			previousCheck.enabled;

		if (isNextCheckIndex) {
			return (check.enabled = true);
		}

		check.enabled = isPrevCheckAccepted;
	});

	return draftCheckList;
}

export function areChecksReadyToBeSubmitted(checks: ExtendedCheck[]) {
	return (
		checks.some(ch => ch.result === CheckResultEnum.No) ||
		checks.every(ch => ch.result === CheckResultEnum.Yes)
	);
}
