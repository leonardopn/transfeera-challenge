import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	//SECTION: Helmet config
	app.use(helmet());

	//SECTION: Cors config
	app.enableCors();

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
