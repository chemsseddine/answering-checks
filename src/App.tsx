import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './components/GlobalStyle';
import AnsweringChecksForm from './AnsweringChecks/AnsweringChecksForm';

const queryClient = new QueryClient();

const theme = {
	primary: '#004e5f',
	highlight: '#def7f7',
};

function App() {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<QueryClientProvider client={queryClient}>
				<AnsweringChecksForm />
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
