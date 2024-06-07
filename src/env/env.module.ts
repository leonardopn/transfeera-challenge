import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "./env.validation";

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate,
		}),
	],
})
export class EnvModule {}
