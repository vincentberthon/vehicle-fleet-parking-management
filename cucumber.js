export default {
	default: {
		require: ["src/tests/**/**/*.ts"],
		requireModule: ["ts-node/register"],
		format: ["progress", "json:reports/cucumber-report.json"],
		paths: ["src/tests/features/*.feature"],
		publishQuiet: true,
	},
};
