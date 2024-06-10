import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { applyNestMainConfig } from "./config/Nest";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	//NOTE: Apply Nest main config
	applyNestMainConfig(app);

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
