import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { exec } from "child_process";
import { unlink } from "fs/promises";
import helmet from "helmet";
import { join } from "path";
import * as request from "supertest";
import {} from "../../prisma/seed";
import { AppModule } from "../app.module";
import { DatabaseService } from "../database/database.service";
import { AppEnvironment } from "../env/env.validation";
import { IReceiver } from "../interfaces/IReceiver";
import { CreateReceiverDto } from "./dto/create-receiver";
import { SearchServiceReturn } from "./types/searchReturn";

describe("Receiver Integration Tests", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [DatabaseService],
		}).compile();

		app = moduleFixture.createNestApplication();

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

		await app.init();

		await new Promise((resolve, reject) => {
			exec("npm run prisma:migrate", (error, stdout, stderr) => {
				if (error) {
					console.log(stderr);
					reject(error);
				}
				console.log(stdout);
				resolve(stdout);
			});
		});
	});

	it("should create, retrieve, and delete a receiver", async () => {
		//NOTE: Create a receiver data
		const createReceiverDto: CreateReceiverDto = {
			completed_name: "John Doe",
			cpf_cnpj: "47338204888",
			email: "TEST@EMAIL.COM",
			pix_data: {
				pix_key_type: "CPF",
				pix_key: "111.111.111-11",
			},
		};

		//NOTE: Create a receiver
		const createResponse = await request(app.getHttpServer())
			.post("/receiver")
			.send(createReceiverDto)
			.expect(response => {
				console.log("Created receiver: ", response.body);
			})
			.expect(201);

		//NOTE: Keep a copy of the created receiver returned by the API
		const createdReceiver = createResponse.body as IReceiver;

		//NOTE: Create a search param to search the receiver after
		const searchUrl = `/receiver?${new URLSearchParams("q=" + createdReceiver.completed_name).toString()}`;
		console.log(searchUrl);

		//NOTE: Search the receiver
		await request(app.getHttpServer())
			.get(searchUrl)
			.expect(200)
			.then(response => {
				const responseBody = response.body as SearchServiceReturn;

				expect(responseBody.values.find(r => r.id === createdReceiver.id)?.id).toBe(
					createdReceiver.id
				);
			});

		//NOTE: Delete the receiver
		await request(app.getHttpServer()).delete(`/receiver/${createdReceiver.id}`).expect(204);

		//NOTE: Search the receiver again to verify it was deleted
		await request(app.getHttpServer())
			.get(searchUrl)
			.expect(200)
			.then(response => {
				const responseBody = response.body as SearchServiceReturn;

				expect(responseBody.values.find(r => r.id === createdReceiver.id)?.id).not.toBe(
					createdReceiver.id
				);
			});
	});

	afterAll(async () => {
		//NOTE: Aftern all tests, delete the test database and close the app
		await unlink(join(__dirname, "../../prisma/database/index_test.db"));
		await app.close();
	});
});
