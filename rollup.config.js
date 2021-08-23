// import typescript from '@rollup/plugin-typescript';
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";
import dts from "rollup-plugin-dts";
const input = "src/index.ts";
const keys = (deps) => (deps == null ? [] : Object.keys(deps).map((dep) => new RegExp(`^${dep}`)));

export default [
	{
		input,
		output: [
			{
				file: "dist/index.js",
				format: "esm",
				sourcemap: true,
			},
		],
		external: [...keys(pkg.dependencies), ...keys(pkg.peerDependencies)],
		plugins: [typescript()],
		watch: {
			clearScreen: false,
		},
	},
	{
		// path to your declaration files root
		input: "./dist/index.d.ts",
		output: [{ file: "dist/index.d.ts", format: "es" }],
		plugins: [dts()],
	},
];
