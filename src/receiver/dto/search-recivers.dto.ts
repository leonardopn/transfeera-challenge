import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min, isDefined } from "class-validator";

export class SearchReceiversDto {
	@IsOptional()
	@ApiProperty({
		description: "Query to search receivers by Status, Nome, Tipo da chave ou Valor da chave",
		example: "Validado",
		required: false,
	})
	@IsString()
	@Transform(({ value }) => (isDefined(value) ? value : ""))
	q: string = "";

	@IsNumber()
	@Min(1)
	@Transform(({ value }) => (isDefined(value) ? Number(value) : 1))
	@IsOptional()
	@ApiProperty({
		description: "Page number to get receivers",
		example: 1,
		required: false,
	})
	page: number = 1;
}
