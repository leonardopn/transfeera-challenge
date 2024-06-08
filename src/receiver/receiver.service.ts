import { Injectable } from "@nestjs/common";
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
}
