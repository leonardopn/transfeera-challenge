import { IReceiver } from "../../interfaces/Receiver";

export interface ISearchReturn {
	values: IReceiver[];
	totalPages: number;
	totalCount: number;
	quantityPerPage: number;
}
