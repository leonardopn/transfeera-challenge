import { Test, TestingModule } from "@nestjs/testing";
import { ReceiverService } from "./receiver.service";
import { DatabaseService } from "../database/database.service";

describe("ReceiverService", () => {
	let service: ReceiverService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [DatabaseService, ReceiverService],
		}).compile();

		service = module.get<ReceiverService>(ReceiverService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
