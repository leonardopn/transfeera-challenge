import { plainToInstance } from "class-transformer";

import { validateSync } from "class-validator";

import { IsEnum, IsNumber, Max, Min } from "class-validator";

export enum AppEnvironment {
	Development = "development",
	Production = "production",
}

export class EnvironmentVariablesDto {
	@IsEnum(AppEnvironment)
	NODE_ENV: AppEnvironment;

	@IsNumber()
	@Min(0)
	@Max(65535)
	PORT: number;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariablesDto, config, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	return validatedConfig;
}
