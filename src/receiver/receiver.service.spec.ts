import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IReceiver } from "src/interfaces/Receiver";
import { DatabaseService } from "../database/database.service";
import { ReceiverService } from "./receiver.service";
import { CreateReceiverDto } from "./dto/create-receiver.dto";

describe("ReceiverService", () => {
	let receiverService: ReceiverService;
	let dbService: DatabaseService;
	const defaultReceiver: IReceiver = {
		id: 1,
		completed_name: "John Doe",
		cpf_cnpj: "12345678900",
		email: "teste@email.com",
		pix_key_type: "CPF",
		pix_key: "111.111.111-11",
		created_at: new Date(),
		updated_at: new Date(),
		status: "Rascunho",
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReceiverService,
				{
					provide: DatabaseService,
					useValue: {
						receiver: {
							findUnique: jest.fn(),
							delete: jest.fn(),
							create: jest.fn(),
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

			jest.spyOn(dbService.receiver, "findUnique").mockResolvedValue(defaultReceiver);

			const result = await receiverService.getOne(id);

			expect(result).toBe(defaultReceiver);
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

	describe("removeOne", () => {
		it("should call getOne and delete the receiver if found", async () => {
			const id = 1;

			jest.spyOn(receiverService, "getOne").mockResolvedValue(defaultReceiver);
			jest.spyOn(dbService.receiver, "delete").mockResolvedValue(defaultReceiver);

			const result = await receiverService.removeOne(id);

			expect(receiverService.getOne).toHaveBeenCalledWith(id, true);
			expect(dbService.receiver.delete).toHaveBeenCalledWith({ where: { id } });
			expect(result).toBe(defaultReceiver);
		});

		it("should throw NotFoundException if receiver not found", async () => {
			const id = 1;
			jest.spyOn(receiverService, "getOne").mockRejectedValue(
				new NotFoundException("Receiver not found")
			);

			await expect(receiverService.removeOne(id)).rejects.toThrow(NotFoundException);
			expect(receiverService.getOne).toHaveBeenCalledWith(id, true);
			expect(dbService.receiver.delete).not.toHaveBeenCalled();
		});
	});

	describe("createOne", () => {
		it("should create a new receiver", async () => {
			const createReceiverDto: CreateReceiverDto = {
				completed_name: "Jane Doe",
				cpf_cnpj: "09876543210",
				email: "jane@email.com",
				pix_data: {
					pix_key_type: "CPF",
					pix_key: "222.222.222-22",
				},
			};

			const newReceiver: IReceiver = {
				...defaultReceiver,
				...createReceiverDto,
				pix_key_type: createReceiverDto.pix_data.pix_key_type,
				pix_key: createReceiverDto.pix_data.pix_key,
			};

			jest.spyOn(dbService.receiver, "create").mockResolvedValue(newReceiver);

			const result = await receiverService.createOne(createReceiverDto);

			expect(dbService.receiver.create).toHaveBeenCalledWith({
				data: {
					completed_name: createReceiverDto.completed_name,
					cpf_cnpj: createReceiverDto.cpf_cnpj,
					email: createReceiverDto.email,
					pix_key_type: createReceiverDto.pix_data.pix_key_type,
					pix_key: createReceiverDto.pix_data.pix_key,
				},
			});
			expect(result).toBe(newReceiver);
		});
	});
});
