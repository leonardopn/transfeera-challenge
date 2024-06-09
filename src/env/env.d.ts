import { EnvironmentVariablesDto } from "./env.validation";

declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvironmentVariablesDto {}
	}
}
