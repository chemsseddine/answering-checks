import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './components/GlobalStyle';
import AnsweringChecksForm from './AnsweringChecks/AnsweringChecksForm';

const queryClient = new QueryClient();

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
