import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import AnsweringChecksForm from './AnsweringChecks/AnsweringChecksForm';

const GlobalStyle = createGlobalStyle`
	p,h1,h2,h3,h4,h5 {
		margin-bottom: 0;
	}
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

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
