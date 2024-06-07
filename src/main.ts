import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import { ValidationPipe } from "@nestjs/common";
import { AppEnvironment } from "./env/env.validation";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	//SECTION: Helmet config
	app.use(helmet());

	//SECTION: Cors config
	app.enableCors();

	//SECTION: Global validation
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			enableDebugMessages: process.env.NODE_ENV !== AppEnvironment.Production,
		})
	);

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
