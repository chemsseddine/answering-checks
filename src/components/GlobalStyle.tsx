import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
	body,html {
		width: 100%;
		height: 100%;
	}
	#root {
		width: 100%;
		height: 100vh;
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
