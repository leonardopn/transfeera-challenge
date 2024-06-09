import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, ArrayUnique, IsNumber, IsPositive } from "class-validator";

export class DeleteManyReceiversDto {
	@ApiProperty({
		description: "List of ids to delete",
		example: [1, 2, 3],
		required: true,
	})
	@IsNumber({}, { each: true })
	@IsPositive({ each: true })
	@ArrayMinSize(1)
	@ArrayUnique()
	ids: number[];
}
