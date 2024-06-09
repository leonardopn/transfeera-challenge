import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Prisma, Receiver } from "@prisma/client";
import { IReceiver } from "src/interfaces/Receiver";
import { CreateReceiverDto } from "./dto/create-receiver.dto";
import { PatchOneReceiverDto } from "./dto/patch-one-receiver.dto";
import { RemoveManyReceiversDto } from "./dto/remove-many-receivers.dto";
import { SearchReceiversDto } from "./dto/search-recivers.dto";
import { ReceiverController } from "./receiver.controller";
import { ReceiverService } from "./receiver.service";

describe("ReceiverController", () => {
	let receiverController: ReceiverController;
	let receiverService: ReceiverService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ReceiverController],
			providers: [
				{
					provide: ReceiverService,
					useValue: {
						createOne: jest.fn(),
						search: jest.fn(),
						removeMany: jest.fn(),
						removeOne: jest.fn(),
						patchOne: jest.fn(),
					},
				},
			],
		}).compile();

		receiverController = module.get<ReceiverController>(ReceiverController);
		receiverService = module.get<ReceiverService>(ReceiverService);
	});

	describe("search", () => {
		it("should call receiverService.search with correct data", async () => {
			const searchReceiverDto: SearchReceiversDto = {
				page: 1,
				q: "test",
			};

			const result = {
				values: [],
				totalPages: 0,
				totalCount: 0,
				quantityPerPage: 10,
			};

			jest.spyOn(receiverService, "search").mockResolvedValue(result);

			const response = await receiverController.search(searchReceiverDto);

			expect(receiverService.search).toHaveBeenCalledWith(
				searchReceiverDto.q,
				searchReceiverDto.page
			);

			expect(response).toBe(result);
		});
	});

	describe("createOne", () => {
		it("should call receiverService.createOne with correct data", async () => {
			const createReceiverDto: CreateReceiverDto = {
				completed_name: "John Doe",
				cpf_cnpj: "12345678900",
				email: "teste@email.com",
				pix_data: {
					pix_key_type: "CPF",
					pix_key: "111.111.111-11",
				},
			};

			const { pix_data, ...restData } = createReceiverDto;

			const result: IReceiver = {
				id: 400,
				created_at: new Date(),
				updated_at: new Date(),
				status: "Rascunho",
				pix_key: pix_data.pix_key,
				pix_key_type: pix_data.pix_key_type,
				email: restData.email || "",
				...restData,
			};

			jest.spyOn(receiverService, "createOne").mockResolvedValue(result);

			const response = await receiverController.createOne(createReceiverDto);

			expect(receiverService.createOne).toHaveBeenCalledWith(createReceiverDto);

			expect(response).toBe(result);
		});
	});

	describe("removeMany", () => {
		it("should call receiverService.removeMany with correct data", async () => {
			const removeManyReceiverDto: RemoveManyReceiversDto = {
				ids: [1, 2, 3, 4, 5],
			};

			const result: Prisma.BatchPayload = {
				count: removeManyReceiverDto.ids.length,
			};

			jest.spyOn(receiverService, "removeMany").mockResolvedValue(result);

			const response = await receiverController.removeMany(removeManyReceiverDto);

			expect(receiverService.removeMany).toHaveBeenCalledWith(removeManyReceiverDto.ids);

			expect(response).toBe(undefined); //NOTE: This route return nothing (HTTP 204)
		});
	});

	describe("removeOne", () => {
		it("should call receiverService.removeOne with correct data", async () => {
			jest.spyOn(receiverService, "removeOne").mockResolvedValue({
				completed_name: "John Doe",
				cpf_cnpj: "12345678900",
				email: "teste@email.com",
				pix_key_type: "CPF",
				pix_key: "111.111.111-11",
				created_at: new Date(),
				updated_at: new Date(),
				id: 1,
				status: "Rascunho",
			});

			const response = await receiverController.removeOne(1);

			expect(receiverService.removeOne).toHaveBeenCalledWith(1);

			expect(response).toBe(undefined); //NOTE: This route return nothing (HTTP 204)
		});

		it("should throw BadRequestException if id is not a valid number", async () => {
			const id = "invalid" as any;

			await expect(receiverController.removeOne(id)).rejects.toThrow(BadRequestException);
		});

		it("should throw BadRequestException if id is a negative number", async () => {
			const id = -1;

			await expect(receiverController.removeOne(id)).rejects.toThrow(BadRequestException);
		});
	});

	describe("patchOne", () => {
		it("should call receiverService.patchOne with correct data", async () => {
			const patchOneReceiverDto: PatchOneReceiverDto = {
				id: 1,
				completed_name: "New Name",
				cpf_cnpj: "12345678901",
				email: "newemail@example.com",
				pix_data: {
					pix_key_type: "CPF",
					pix_key: "12345678901",
				},
			};

			const result: Receiver = {
				id: patchOneReceiverDto.id,
				completed_name: "New Name",
				cpf_cnpj: "12345678901",
				email: "newemail@example.com",
				pix_key_type: "CPF",
				pix_key: "12345678901",
				status: "Rascunho",
				created_at: new Date(),
				updated_at: new Date(),
			};

			jest.spyOn(receiverService, "patchOne").mockResolvedValue(result);

			const response = await receiverController.patchOne(patchOneReceiverDto);

			expect(receiverService.patchOne).toHaveBeenCalledWith(patchOneReceiverDto);
			expect(response).toBe(result);
		});
	});
});
