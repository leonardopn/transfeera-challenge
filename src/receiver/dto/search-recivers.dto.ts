import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class SearchReceiversDto {
	@IsOptional()
	@ApiProperty({
		description: "Query to search receivers by Status, Nome, Tipo da chave ou Valor da chave",
		example: "Validado",
		required: false,
	})
	q: string = "";

	@IsNumber()
	@Min(1)
	@Transform(({ value }) => Number(value))
	@IsOptional()
	@ApiProperty({
		description: "Page number to get receivers",
		example: 1,
		required: false,
	})
	page: number = 1;
}
