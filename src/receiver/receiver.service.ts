import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { IReceiver, IUpgradeReceiver } from "src/interfaces/Receiver";
import { CreateReceiverDto } from "./dto/create-receiver.dto";
import { PatchOneReceiverDto } from "./dto/patch-one-receiver.dto";

@Injectable()
export class ReceiverService {
	constructor(private dbService: DatabaseService) {}

	createOne(data: CreateReceiverDto) {
		const newReceiver = this.dbService.receiver.create({
			data,
		});

		return newReceiver;
	}

	async getOne<T extends boolean = false>(id: number, throwError?: T) {
		//NOTE: Get the receiver by his id
		const foundReceiver = await this.dbService.receiver.findUnique({ where: { id } });

		//NOTE: Throw an error if not found and throwError is true
		if (throwError && !foundReceiver) {
			throw new NotFoundException("Receiver not found");
		}

		//NOTE: Return the receiver with a dynamic type based on throwError
		return foundReceiver as T extends true ? IReceiver : IReceiver | null;
	}

	async removeOne(id: number) {
		//NOTE: Get the receiver by his id  and throw an error if not found
		await this.getOne(id, true);

		//NOTE: Remove the receiver
		return this.dbService.receiver.delete({ where: { id } });
	}

	async removeMany(ids: number[]) {
		return this.dbService.receiver.deleteMany({ where: { id: { in: ids } } });
	}

	async patchOne(data: PatchOneReceiverDto) {
		//NOTE: Get the receiver by his id
		const foundReceiver = await this.getOne(data.id, true);

		//NOTE: Keep a copy of the receiver data to update after.
		let dataToUpdateReceiver: IUpgradeReceiver = {
			id: data.id,
			completed_name: data.completed_name,
			cpf_cnpj: data.cpf_cnpj,
			email: data.email,
			pix_key_type: data.pix_data?.pix_key_type,
			pix_key: data.pix_data?.pix_key,
		};

		//NOTE: If the receiver was validated, we only can update the email
		if (foundReceiver.status === "Validado") {
			dataToUpdateReceiver = { id: data.id, email: data.email };
		}

		//NOTE: Update the receiver
		return this.dbService.receiver.update({
			where: { id: data.id },
			data: dataToUpdateReceiver,
		});
	}
}
