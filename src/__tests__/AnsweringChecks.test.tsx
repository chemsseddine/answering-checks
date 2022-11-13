import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sortAndInitializeChecks } from '../AnsweringChecks/updateChecks';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AnsweringChecksForm from '../AnsweringChecks/AnsweringChecksForm';
import { theme } from '../components/GlobalStyle';

const wrapper = ({ children }: any) => {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

jest.mock('@tanstack/react-query', () => ({
	useQuery: jest.fn().mockReturnValue({
		data: sortAndInitializeChecks([
			{ id: '3', priority: 3, description: 'last' },
			{ id: '1', priority: 1, description: 'first' },
			{ id: '2', priority: 2, description: 'second' },
		]),
		isLoading: false,
		error: {},
	}),
	useMutation: jest.fn().mockReturnValue({
		mutation: jest.fn(),
		isLoading: false,
		isSuccess: false,
		isError: false,
	}),
}));

afterEach(() => {
	jest.clearAllMocks();
});

describe('AnsweringChecks Component', () => {
	test('Display list of checks by ordered by priority', async () => {
		render(<AnsweringChecksForm />, { wrapper });

		const allChecks = screen.getAllByTestId('answering-check', {
			exact: false,
		});
		expect(allChecks.length).toBe(3);
		expect(allChecks[0]).toHaveTextContent('first');
		expect(allChecks[1]).toHaveTextContent('second');
		expect(allChecks[2]).toHaveTextContent('last');
	});

	test('First Check should be enabled by default', async () => {
		render(<AnsweringChecksForm />, { wrapper });

		const firstCheck = screen.getByTestId('answering-check-0');
		const yesBtn = within(firstCheck).getByText(/yes/i);
		const noBtn = within(firstCheck).getByText(/no/i);

		expect(yesBtn).not.toBeDisabled();
		expect(noBtn).not.toBeDisabled();
	});

	test('All remaining checks should be disabled by default', async () => {
		render(<AnsweringChecksForm />, { wrapper });

		const allChecks = screen.getAllByTestId('answering-check', {
			exact: false,
		});
		allChecks.forEach((check, idx) => {
			// ignore first check
			if (idx === 0) return;
			const yesBtn = within(check).getByText(/yes/i);
			const noBtn = within(check).getByText(/no/i);
			expect(yesBtn).toBeDisabled();
			expect(noBtn).toBeDisabled();
		});
	});

	test('Answering with Yes should enable next Check', async () => {
		render(<AnsweringChecksForm />, { wrapper });

		const firstCheck = screen.getByTestId('answering-check-0');
		const firstYesBtn = within(firstCheck).getByText(/yes/i);

		await userEvent.click(firstYesBtn);

		const secondCheck = screen.getByTestId('answering-check-1');
		const secondYesBtn = within(secondCheck).getByText(/yes/i);
		const secondNoBtn = within(secondCheck).getByText(/no/i);
		expect(secondYesBtn).not.toBeDisabled();
		expect(secondNoBtn).not.toBeDisabled();
	});

	test('Answering with No should enable submit button', async () => {
		render(<AnsweringChecksForm />, { wrapper });

		const firstCheck = screen.getByTestId('answering-check-0');
		const firstNoBtn = within(firstCheck).getByText(/no/i);

		const submitBtn = screen.getByText(/submit/i);

		expect(submitBtn).toBeDisabled();
		await userEvent.click(firstNoBtn);
		expect(submitBtn).not.toBeDisabled();
	});

	test('Answering All with Yes should enable submit button', async () => {
		render(<AnsweringChecksForm />, { wrapper });

		const allChecks = screen.getAllByTestId('answering-check', {
			exact: false,
		});

		for (const check of allChecks) {
			const yesBtn = within(check).getByText(/yes/i);
			await userEvent.click(yesBtn);
		}

		const submitBtn = screen.getByText(/submit/i);

		expect(submitBtn).not.toBeDisabled();
	});
});
