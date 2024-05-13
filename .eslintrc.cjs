module.exports = {
	env: {
		browser: true,  // Enable browser global variables
		es2021: true,   // Enables ES12 features
		node: true      // Enable Node.js global variables and Node.js scoping.
	},
	extends: [
		'eslint:recommended',  // Use the recommended rules from ESLint
	],
	parserOptions: {
		ecmaVersion: 2021,     // Allows for the parsing of modern ECMAScript features
		sourceType: 'module',  // Allows using import/export statements
	},
	rules: {
		'no-console': 'warn',  // Turns no-console rule into a warning
		'eqeqeq': ['error', 'always'],  // Enforces strict equality '==='
		'curly': ['error', 'all'],      // Requires curly braces for all control statements
		'no-unused-vars': ['error', {   // Error on unused variables except for underscores
			argsIgnorePattern: '^_'
		}],
		'no-var': 'error',             // Error on var (use let or const)
		'prefer-const': 'error',       // Prefer const over let where possible
	}
};
