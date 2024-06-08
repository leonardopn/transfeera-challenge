import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateReceiverDto } from "./dto/create-receiver.dto";

@Injectable()
export class ReceiverService {
	constructor(private dbService: DatabaseService) {}

	createOne(data: CreateReceiverDto) {
		const newReceiver = this.dbService.receiver.create({
			data,
		});

		return newReceiver;
	}

	getOne(id: number) {
		return this.dbService.receiver.findUnique({ where: { id } });
	}

	async removeOne(id: number) {
		const receiver = await this.getOne(id);

		if (!receiver) {
			throw new NotFoundException("Receiver not found");
		}

		return this.dbService.receiver.delete({ where: { id } });
	}

	async removeMany(ids: number[]) {
		return this.dbService.receiver.deleteMany({ where: { id: { in: ids } } });
	}
}
