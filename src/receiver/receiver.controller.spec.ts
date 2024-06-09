import { Test, TestingModule } from "@nestjs/testing";
import { ReceiverController } from "./receiver.controller";
import { ReceiverService } from "./receiver.service";
import { CreateReceiverDto } from "./dto/create-receiver.dto";
import { IReceiver } from "src/interfaces/Receiver";

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
					},
				},
			],
		}).compile();

		receiverController = module.get<ReceiverController>(ReceiverController);
		receiverService = module.get<ReceiverService>(ReceiverService);
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
});
