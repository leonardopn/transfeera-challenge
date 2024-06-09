import { validate, AppEnvironment, EnvironmentVariablesDto } from "./env.validation";

describe("EnvironmentVariables", () => {
	it("should validate and return valid environment variables", () => {
		const config = {
			NODE_ENV: AppEnvironment.Development,
			PORT: 3000,
		};

		const validatedConfig = validate(config);

		expect(validatedConfig).toBeInstanceOf(EnvironmentVariablesDto);
		expect(validatedConfig).toEqual({
			NODE_ENV: AppEnvironment.Development,
			PORT: 3000,
		});
	});

	it("should throw an error if NODE_ENV is invalid", () => {
		const config = {
			NODE_ENV: "invalid_env",
			PORT: 3000,
		};

		expect(() => validate(config)).toThrow();
	});

	it("should throw an error if PORT is below the minimum value", () => {
		const config = {
			NODE_ENV: AppEnvironment.Production,
			PORT: -1,
		};

		expect(() => validate(config)).toThrow();
	});

	it("should throw an error if PORT exceeds the maximum value", () => {
		const config = {
			NODE_ENV: AppEnvironment.Production,
			PORT: 70000,
		};

		expect(() => validate(config)).toThrow();
	});

	it("should validate and convert string numbers to numeric type for PORT", () => {
		const config = {
			NODE_ENV: AppEnvironment.Development,
			PORT: "8080", // String that should be converted to number
		};

		const validatedConfig = validate(config);

		expect(validatedConfig.PORT).toBe(8080);
	});
});
