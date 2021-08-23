module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		quotes: ["error", "double"],
		indent: [2, "tab"],
		"@typescript-eslint/indent": [0, "tab"],
		"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
		"@typescript-eslint/quotes": [
			"error",
			"double",
			{
				allowTemplateLiterals: true,
			},
		],
		// "import/no-extraneous-dependencies": [
		// 	"error",
		// 	{
		// 		devDependencies: ["*.js", "**/*.test.ts"],
		// 	},
		// ],
		"comma-dangle": [
			"error",
			{
				arrays: "always-multiline",
				objects: "always-multiline",
				imports: "always-multiline",
				exports: "always-multiline",
				functions: "only-multiline",
			},
		],
	},
};
