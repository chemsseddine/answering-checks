import { useQuery, useMutation } from '@tanstack/react-query';
import {
	ExtendedCheck,
	Check,
	sortAndInitializeChecks,
} from './containers/AnsweringChecks/updateChecks';

export function fetchChecks(): Promise<Check[]> {
	return new Promise((resolve, reject) =>
		setTimeout(
			() =>
				Math.random() <= 0.8
					? resolve([
							{
								id: 'aaa',
								priority: 10,
								description:
									'Face on the picture matches face on the document',
							},
							{
								id: 'bbb',
								priority: 5,
								description:
									'Veriff supports presented document',
							},
							{
								id: 'ccc',
								priority: 7,
								description: 'Face is clearly visible',
							},
							{
								id: 'ddd',
								priority: 3,
								description: 'Document data is clearly visible',
							},
					  ])
					: reject({ success: false }),
			500
		)
	);
}

export interface Result {
	checkId: string;
	result: 'yes' | 'no';
}

export function prepareCheckResultsPayload(checks: ExtendedCheck[]): Result[] {
	return checks.map(({ checkId, result }) => ({
		checkId,
		result: result ?? 'no',
	}));
}

/**
 * @param {Object[]} results - The list of check results
 * @param {string} results[].checkId - Check id
 * @param {string} results[].result - Result value (yes / no)
 */
export function submitCheckResults(results: Result[]) {
	return new Promise((resolve, reject) =>
		setTimeout(
			() =>
				Math.random() <= 0.8
					? resolve(results)
					: reject({ success: false }),
			500
		)
	);
}

export function useChecksQuery() {
	const query = useQuery({
		queryKey: ['checks'],
		queryFn: fetchChecks,
		select: sortAndInitializeChecks,
	});

	return query;
}

export function useSubmitCheckResult() {
	const mutation = useMutation({
		mutationFn: (checkResults: ExtendedCheck[]) => {
			return submitCheckResults(prepareCheckResultsPayload(checkResults));
		},
	});

	return mutation;
}
