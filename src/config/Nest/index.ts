import { INestApplication, ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { AppEnvironment } from "../../env/env.validation";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/**
 * Function to apply Nest main config
 */
export function applyNestMainConfig(app: INestApplication) {
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

	//SECTION: Swagger config (only in development)
	if (process.env.NODE_ENV === AppEnvironment.Development) {
		const config = new DocumentBuilder()
			.setTitle("transfeera-challenge")
			.setDescription("Api for transfeera-challenge")
			.setVersion("1.0")
			.build();

		const document = SwaggerModule.createDocument(app, config);

		SwaggerModule.setup("api", app, document);
	}

	return app;
}
