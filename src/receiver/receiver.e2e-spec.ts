import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { exec } from "child_process";
import { unlink } from "fs/promises";
import { join } from "path";
import { applyNestMainConfig } from "../config/Nest";
import * as request from "supertest";
import { AppModule } from "../app.module";
import { DatabaseService } from "../database/database.service";
import { IReceiver } from "../interfaces/IReceiver";
import { CreateReceiverDto } from "./dto/create-receiver";
import { SearchServiceReturn } from "./types/searchReturn";
import { PatchOneReceiverDto } from "./dto/patch-one-receiver";

describe("Receiver Integration Tests", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [DatabaseService],
		}).compile();

		app = moduleFixture.createNestApplication();

		//NOTE: Apply Nest main config
		applyNestMainConfig(app);

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
	}, 10000);

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

	it("should update a receiver partially (Rascunho)", async () => {
		//NOTE: Create a receiver object
		const createReceiverDto: CreateReceiverDto = {
			completed_name: "John Doe",
			cpf_cnpj: "47338204888",
			email: "TEST@EXAMPLE.COM",
			pix_data: {
				pix_key_type: "CPF",
				pix_key: "111.111.111-11",
			},
		};

		//NOTE: Create a temp receiver on DB
		const createResponse = await request(app.getHttpServer())
			.post("/receiver")
			.send(createReceiverDto)
			.expect(201);

		//NOTE: Keep a copy of the created receiver
		const createdReceiver = createResponse.body as IReceiver;

		//NOTE: Partially update the receiver
		const updateDto: PatchOneReceiverDto = {
			id: createdReceiver.id,
			cpf_cnpj: "123.456.789-00",
		};
		const updateResponse = await request(app.getHttpServer())
			.patch(`/receiver`)
			.send(updateDto)
			.expect(200);

		//NOTE: Verify if the receiver was updated
		expect(updateResponse.body.cpf_cnpj).toBe(updateDto.cpf_cnpj);

		//NOTE: Create a search param to search the receiver after
		const searchUrl = `/receiver?${new URLSearchParams("q=" + createdReceiver.completed_name).toString()}`;

		//NOTE: Search the created receiver
		const getResponse = await request(app.getHttpServer()).get(searchUrl).expect(200);
		const searchResult = getResponse.body as SearchServiceReturn;

		//NOTE: Verify if the receiver was updated
		expect(searchResult.values.find(r => r.id === createdReceiver.id)?.cpf_cnpj).toBe(
			updateDto.cpf_cnpj
		);

		//NOTE: Delete the receiver
		await request(app.getHttpServer()).delete(`/receiver/${createdReceiver.id}`).expect(204);
	});

	it("should paginate receivers", async () => {
		const totalReceivers = 30; //NOTE: Assuming the database starts with 30 receivers
		const limit = 10;

		//NOTE: Verify pagination - first page
		const firstPageResponse = await request(app.getHttpServer())
			.get(`/receiver?page=1`)
			.expect(200);

		const firstPageReceivers = firstPageResponse.body as SearchServiceReturn;

		expect(firstPageReceivers.values.length).toBe(limit);
		expect(firstPageReceivers.totalCount).toBe(totalReceivers);

		//NOTE: Verify pagination - second page
		const secondPageResponse = await request(app.getHttpServer())
			.get(`/receiver?page=2`)
			.expect(200);

		const secondPageReceivers = secondPageResponse.body as SearchServiceReturn;

		expect(secondPageReceivers.values.length).toBe(limit);
		expect(secondPageReceivers.totalCount).toBe(totalReceivers);

		//NOTE: Verify pagination - third page
		const thirdPageResponse = await request(app.getHttpServer())
			.get(`/receiver?page=3`)
			.expect(200);

		const thirdPageReceivers = thirdPageResponse.body as SearchServiceReturn;

		expect(thirdPageReceivers.values.length).toBe(totalReceivers - 2 * limit);
		expect(thirdPageReceivers.totalCount).toBe(totalReceivers);

		//NOTE: Verify pagination - fourth page - should return an error
		await request(app.getHttpServer()).get(`/receiver?page=4`).expect(412);

		//NOTE: Verify an empty page
		await request(app.getHttpServer())
			.get(`/receiver?q=NOT_FOUND`)
			.expect(200)
			.then(response => {
				const responseBody = response.body as SearchServiceReturn;
				expect(responseBody.totalCount).toBe(0);
				expect(responseBody.totalPages).toBe(0);
				expect(responseBody.quantityPerPage).toBe(10);
				expect(responseBody.values.length).toBe(0);
			});
	});

	it("should delete a receiver by id", async () => {
		//NOTE: Retrieve the first receiver
		const searchResponse = await request(app.getHttpServer())
			.get(`/receiver?&page=1`)
			.expect(200);

		const searchResult = searchResponse.body as SearchServiceReturn;
		const receiverToDelete = searchResult.values[0];

		//NOTE: Verify if the receiver was retrieved
		expect(receiverToDelete).toBeDefined();

		//NOTE: Delete the receiver
		await request(app.getHttpServer()).delete(`/receiver/${receiverToDelete.id}`).expect(204);

		// Verify the receiver was deleted
		await request(app.getHttpServer()).get(`/receiver/${receiverToDelete.id}`).expect(404);
	});

	it("should return 404 when deleting a non-existent receiver", async () => {
		const nonExistentId = 9999;

		//NOTE: Attempt to delete a non-existent receiver
		await request(app.getHttpServer()).delete(`/receiver/${nonExistentId}`).expect(404);
	});

	afterAll(async () => {
		//NOTE: After all tests, delete the test database and close the app
		await unlink(join(__dirname, "../../prisma/database/index_test.db"));
		await app.close();
	});
});
