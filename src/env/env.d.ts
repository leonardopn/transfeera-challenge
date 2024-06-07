import { EnvironmentVariables } from "./env.validation";

declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvironmentVariables {}
	}
}
