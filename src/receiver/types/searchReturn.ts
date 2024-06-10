import { ApiProperty } from "@nestjs/swagger";
import { Receiver } from "../../classes/Receiver";

export class SearchServiceReturn {
	@ApiProperty({
		description: "The values returned by the search",
		type: [Receiver],
	})
	values: Receiver[];

	@ApiProperty({
		description: "The total pages of results",
		example: 1,
	})
	totalPages: number;

	@ApiProperty({
		description: "The total count of results",
		example: 1,
	})
	totalCount: number;

	@ApiProperty({
		description: "The quantity per page used in the search",
		example: 10,
	})
	quantityPerPage: number;
}
