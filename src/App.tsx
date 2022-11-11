import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AnsweringChecksForm from './containers/AnsweringChecks/AnsweringChecksForm';
import { ThemeProvider } from 'styled-components';

const queryClient = new QueryClient();

const theme = {
	primary: '#004e5f',
	highlight: '#def7f7',
};

function App() {
	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<AnsweringChecksForm />
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
