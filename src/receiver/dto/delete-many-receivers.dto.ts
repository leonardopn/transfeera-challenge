import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsNumber, IsPositive } from "class-validator";

export class DeleteManyReceiversDto {
	@ApiProperty({
		description: "List of ids to delete",
		example: [1, 2, 3],
		required: true,
	})
	@IsNumber({}, { each: true })
	@IsPositive({ each: true })
	@ArrayMinSize(1)
	ids: number[];
}
