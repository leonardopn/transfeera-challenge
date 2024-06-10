import { Injectable, NotFoundException, PreconditionFailedException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { IReceiver, IUpgradeReceiver } from "../interfaces/IReceiver";
import { CreateReceiverDto } from "./dto/create-receiver";
import { PatchOneReceiverDto } from "./dto/patch-one-receiver";
import { Prisma } from "@prisma/client";
import { SearchServiceReturn } from "./types/searchReturn";

@Injectable()
export class ReceiverService {
	constructor(private dbService: DatabaseService) {}

	/**
	 * @description Create a new receiver on DB
	 * @param data Objet with the data to be created a receiver
	 * @returns An object with the created receiver
	 */
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

	/**
	 * @description Get one receiver from, DB
	 * @param id Unique id to get the receiver
	 * @param throwError Opcional boolean to throw an error if not found receiver
	 * @returns
	 * if `throwErro` is `true` returns an object with the receiver
	 *
	 * if `throwError` is `false` returns an object with the receiver or `null`
	 */
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

	/**
	 * @description Remove one receiver from DB
	 * @param id Unique id to find the receiver
	 * @returns A receiver object that was removed
	 */
	async removeOne(id: number) {
		//NOTE: Get the receiver by his id  and throw an error if not found
		await this.getOne(id, true);

		//NOTE: Remove the receiver
		return this.dbService.receiver.delete({ where: { id } });
	}

	/**
	 * @description Remove multiple receivers from DB
	 * @param ids Array of ids to be removed
	 * @returns A quantity of receivers that were removed
	 */
	async removeMany(ids: number[]) {
		return this.dbService.receiver.deleteMany({ where: { id: { in: ids } } });
	}

	/**
	 * @description Patch one receiver from DB
	 * @param data Partial object with the data to be updated
	 * @returns A receiver object that was updated
	 */
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

	/**
	 * @description Search for receivers on DB with a pagination
	 * @param query A text data to be searched
	 * @param page Number of page to be returned
	 * @returns An objet with the search results, total pages, total count and quantity per page
	 */
	async search(query: string, page: number): Promise<SearchServiceReturn> {
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
