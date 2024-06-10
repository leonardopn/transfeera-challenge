import { NotFoundException, PreconditionFailedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IReceiver } from "../interfaces/IReceiver";
import { DatabaseService } from "../database/database.service";
import { ReceiverService } from "./receiver.service";
import { CreateReceiverDto } from "./dto/create-receiver";
import { PatchOneReceiverDto } from "./dto/patch-one-receiver";

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
							deleteMany: jest.fn(),
							count: jest.fn(),
							findMany: jest.fn(),
							update: jest.fn(),
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

	describe("removeMany", () => {
		it("should delete multiple receivers", async () => {
			const ids = [1, 2, 3];
			const deleteResult = { count: ids.length };

			jest.spyOn(dbService.receiver, "deleteMany").mockResolvedValue(deleteResult);

			const result = await receiverService.removeMany(ids);

			expect(dbService.receiver.deleteMany).toHaveBeenCalledWith({
				where: { id: { in: ids } },
			});
			expect(result).toBe(deleteResult);
		});
	});

	describe("search", () => {
		it("should return search results", async () => {
			const query = "John";
			const page = 1;
			const receivers = [defaultReceiver];
			const totalCount = receivers.length;
			const totalPages = 1;

			jest.spyOn(dbService.receiver, "count").mockResolvedValue(totalCount);
			jest.spyOn(dbService.receiver, "findMany").mockResolvedValue(receivers);

			const result = await receiverService.search(query, page);

			expect(dbService.receiver.count).toHaveBeenCalledWith({
				where: {
					OR: [
						{ status: { contains: query } },
						{ completed_name: { contains: query } },
						{ pix_key_type: { contains: query } },
						{ pix_key: { contains: query } },
					],
				},
			});
			expect(dbService.receiver.findMany).toHaveBeenCalledWith({
				where: {
					OR: [
						{ status: { contains: query } },
						{ completed_name: { contains: query } },
						{ pix_key_type: { contains: query } },
						{ pix_key: { contains: query } },
					],
				},
				take: 10,
				skip: 0,
			});
			expect(result).toEqual({
				values: receivers,
				totalPages,
				totalCount,
				quantityPerPage: 10,
			});
		});

		it("should return empty results if no receivers found", async () => {
			const query = "NonExistent";
			const page = 1;
			const totalCount = 0;
			const totalPages = 0;

			jest.spyOn(dbService.receiver, "count").mockResolvedValue(totalCount);
			jest.spyOn(dbService.receiver, "findMany").mockResolvedValue([]);

			const result = await receiverService.search(query, page);

			expect(dbService.receiver.count).toHaveBeenCalledWith({
				where: {
					OR: [
						{ status: { contains: query } },
						{ completed_name: { contains: query } },
						{ pix_key_type: { contains: query } },
						{ pix_key: { contains: query } },
					],
				},
			});
			expect(result).toEqual({ values: [], totalPages, totalCount, quantityPerPage: 10 });
		});

		it("should throw PreconditionFailedException if page exceeds total pages", async () => {
			const query = "John";
			const page = 2;
			const totalCount = 10;

			jest.spyOn(dbService.receiver, "count").mockResolvedValue(totalCount);

			await expect(receiverService.search(query, page)).rejects.toThrow(
				PreconditionFailedException
			);

			expect(dbService.receiver.count).toHaveBeenCalledWith({
				where: {
					OR: [
						{ status: { contains: query } },
						{ completed_name: { contains: query } },
						{ pix_key_type: { contains: query } },
						{ pix_key: { contains: query } },
					],
				},
			});
		});
	});

	describe("patchOne", () => {
		it('should update the receiver if found and status is not "Validado"', async () => {
			const patchData: PatchOneReceiverDto = {
				id: 1,
				completed_name: "John Doe Updated",
				cpf_cnpj: "12345678900",
				email: "teste_updated@email.com",
				pix_data: {
					pix_key_type: "CPF",
					pix_key: "222.222.222-22",
				},
			};

			const updatedReceiver: IReceiver = {
				...defaultReceiver,
				...patchData,
				pix_key_type: patchData?.pix_data?.pix_key_type || defaultReceiver.pix_key_type,
				pix_key: patchData.pix_data?.pix_key || defaultReceiver.pix_key,
			};

			jest.spyOn(receiverService, "getOne").mockResolvedValue(defaultReceiver);
			jest.spyOn(dbService.receiver, "update").mockResolvedValue(updatedReceiver);

			const result = await receiverService.patchOne(patchData);

			expect(receiverService.getOne).toHaveBeenCalledWith(patchData.id, true);
			expect(dbService.receiver.update).toHaveBeenCalledWith({
				where: { id: patchData.id },
				data: {
					id: patchData.id,
					completed_name: patchData.completed_name,
					cpf_cnpj: patchData.cpf_cnpj,
					email: patchData.email,
					pix_key_type: patchData?.pix_data?.pix_key_type || defaultReceiver.pix_key_type,
					pix_key: patchData.pix_data?.pix_key || defaultReceiver.pix_key,
				},
			});
			expect(result).toBe(updatedReceiver);
		});

		it('should update only email if status is "Validado"', async () => {
			const patchData: PatchOneReceiverDto = {
				id: 1,
				completed_name: "John Doe Updated",
				cpf_cnpj: "12345678900",
				email: "teste_updated@email.com",
				pix_data: {
					pix_key_type: "CPF",
					pix_key: "222.222.222-22",
				},
			};

			const foundReceiverWithStatus: IReceiver = {
				...defaultReceiver,
				status: "Validado",
			};

			const updatedReceiver: IReceiver = {
				...foundReceiverWithStatus,
				email: patchData.email || foundReceiverWithStatus.email,
			};

			jest.spyOn(receiverService, "getOne").mockResolvedValue(foundReceiverWithStatus);
			jest.spyOn(dbService.receiver, "update").mockResolvedValue(updatedReceiver);

			const result = await receiverService.patchOne(patchData);

			expect(receiverService.getOne).toHaveBeenCalledWith(patchData.id, true);
			expect(dbService.receiver.update).toHaveBeenCalledWith({
				where: { id: patchData.id },
				data: {
					id: patchData.id,
					email: patchData.email,
				},
			});
			expect(result).toBe(updatedReceiver);
		});

		it("should throw NotFoundException if receiver not found", async () => {
			const patchData: PatchOneReceiverDto = {
				id: 1,
				completed_name: "John Doe Updated",
				cpf_cnpj: "12345678900",
				email: "teste_updated@email.com",
				pix_data: {
					pix_key_type: "CPF",
					pix_key: "222.222.222-22",
				},
			};

			jest.spyOn(receiverService, "getOne").mockRejectedValue(
				new NotFoundException("Receiver not found")
			);

			await expect(receiverService.patchOne(patchData)).rejects.toThrow(NotFoundException);
			expect(receiverService.getOne).toHaveBeenCalledWith(patchData.id, true);
			expect(dbService.receiver.update).not.toHaveBeenCalled();
		});
	});
});
