import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive } from "class-validator";

export class DeleteManyReceiversDto {
	@ApiProperty({
		description: "List of ids to delete",
		example: [1, 2, 3],
		required: true,
	})
	@IsNumber({}, { each: true })
	@IsPositive({ each: true })
	ids: number[];
}
