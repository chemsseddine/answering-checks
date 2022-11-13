import 'styled-components';

interface Semantic {
	success: string;
	warning: string;
	danger: string;
}

declare module 'styled-components' {
	export interface DefaultTheme {
		primary: string;
		highlight: string;
		semantic: Semantic;
	}
}
