export default {
	transform: {
		'^.+\\.(t|j)sx?$': 'ts-jest',
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	collectCoverageFrom: [
		'./src/**/*.ts',
		'./src/**/*.tsx',
		'!**/node_modules/**',
	],
	coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
};
