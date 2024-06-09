import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IReceiver } from "src/interfaces/Receiver";
import { DatabaseService } from "../database/database.service";
import { ReceiverService } from "./receiver.service";

describe("ReceiverService", () => {
	let receiverService: ReceiverService;
	let dbService: DatabaseService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReceiverService,
				{
					provide: DatabaseService,
					useValue: {
						receiver: {
							findUnique: jest.fn(),
						},
					},
				},
			],
		}).compile();

		receiverService = module.get<ReceiverService>(ReceiverService);
		dbService = module.get<DatabaseService>(DatabaseService);
	});

	describe("getOne", () => {
		it("should return a receiver if found", async () => {
			const id = 1;
			const receiver: IReceiver = {
				id,
				completed_name: "John Doe",
				cpf_cnpj: "12345678900",
				email: "teste@email.com",
				pix_key_type: "CPF",
				pix_key: "111.111.111-11",
				created_at: new Date(),
				updated_at: new Date(),
				status: "Rascunho",
			};
			jest.spyOn(dbService.receiver, "findUnique").mockResolvedValue(receiver);

			const result = await receiverService.getOne(id);

			expect(result).toBe(receiver);
			expect(dbService.receiver.findUnique).toHaveBeenCalledWith({ where: { id } });
		});

		it("should return null if not found and throwError is false", async () => {
			const id = 1;
			jest.spyOn(dbService.receiver, "findUnique").mockResolvedValue(null);

			const result = await receiverService.getOne(id);

			expect(result).toBeNull();
			expect(dbService.receiver.findUnique).toHaveBeenCalledWith({ where: { id } });
		});

		it("should throw NotFoundException if not found and throwError is true", async () => {
			const id = 1;
			jest.spyOn(dbService.receiver, "findUnique").mockResolvedValue(null);

			await expect(receiverService.getOne(id, true)).rejects.toThrow(NotFoundException);
			expect(dbService.receiver.findUnique).toHaveBeenCalledWith({ where: { id } });
		});
	});
});
