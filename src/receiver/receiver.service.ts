import { Injectable, NotFoundException, PreconditionFailedException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { IReceiver, IUpgradeReceiver } from "../interfaces/Receiver";
import { CreateReceiverDto } from "./dto/create-receiver.dto";
import { PatchOneReceiverDto } from "./dto/patch-one-receiver.dto";
import { Prisma } from "@prisma/client";
import { ISearchReturn } from "./types/searchReturn";

@Injectable()
export class ReceiverService {
	constructor(private dbService: DatabaseService) {}

	async createOne(data: CreateReceiverDto): Promise<IReceiver> {
		const { pix_data, ...restData } = data;

		const newReceiver = await this.dbService.receiver.create({
			data: {
				...restData,
				pix_key_type: pix_data.pix_key_type,
				pix_key: pix_data.pix_key,
			},
		});

		return newReceiver as IReceiver;
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

	async search(query: string, page: number): Promise<ISearchReturn> {
		//NOTE: Define the quantity per page
		const quantityPerPage = 10;

		//NOTE: Define the default where to use in the search
		const where: Prisma.ReceiverWhereInput = {
			OR: [
				{ status: { contains: query } },
				{ completed_name: { contains: query } },
				{ pix_key_type: { contains: query } },
				{ pix_key: { contains: query } },
			],
		};

		//NOTE: get the total count and calculate the total pages
		const totalCount = await this.dbService.receiver.count({ where });
		const totalPages = Math.ceil(totalCount / quantityPerPage);

		//NOTE: If the total count is 0, return an empty result
		if (totalCount === 0) {
			return { values: [], totalPages, totalCount, quantityPerPage };
		}

		//NOTE: If the page is greater than the total pages, throw an error
		if (page > totalPages) {
			throw new PreconditionFailedException("Page must be between 1 and " + totalPages);
		}

		//NOTE: Calculate the skip cursor
		const skip = (page - 1) * quantityPerPage;

		//NOTE: Get the values
		const values = (await this.dbService.receiver.findMany({
			where,
			take: quantityPerPage,
			skip,
		})) as IReceiver[];

		//NOTE: Return the values, total pages, total count and quantity per page
		return { values, totalPages, totalCount, quantityPerPage };
	}
}
