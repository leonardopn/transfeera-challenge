import { Test, TestingModule } from "@nestjs/testing";
import { ReceiverController } from "./receiver.controller";
import { ReceiverService } from "./receiver.service";
import { CreateReceiverDto } from "./dto/create-receiver.dto";
import { IReceiver } from "src/interfaces/Receiver";
import { SearchReceiversDto } from "./dto/search-recivers.dto";
import { DeleteManyReceiversDto } from "./dto/delete-many-receivers.dto";
import { Prisma } from "@prisma/client";

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
			const removeManyReceiverDto: DeleteManyReceiversDto = {
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
});
