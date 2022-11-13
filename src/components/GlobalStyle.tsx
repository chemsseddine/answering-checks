import { createGlobalStyle, DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
	primary: '#004e5f',
	highlight: '#def7f7',
	semantic: {
		success: 'green',
		danger: 'red',
		warning: 'yellow',
	},
};

export const GlobalStyle = createGlobalStyle`
	body,html {
		width: 100%;
		height: 100%;
	}
	#root {
		width: 100%;
		height: 100vh;
		color: ${({ theme: tm }) => tm.primary};
	}
	p,
	h1,
	h2,
	h3,
	h4,
	h5 {
		margin-bottom: 0;
	}
  	* {
    	box-sizing: border-box;
    	margin: 0;
    	padding: 0;
  }
`;
