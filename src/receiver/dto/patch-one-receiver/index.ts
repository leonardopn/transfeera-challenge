import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsNotEmpty,
	IsNotEmptyObject,
	IsObject,
	IsOptional,
	IsPositive,
	IsString,
	Matches,
	MaxLength,
	Min,
	ValidateNested,
} from "class-validator";
import { CNPJ_AND_CPF_SCHEMA, UPPERCASE_EMAIL_SCHEMA } from "../../../constant/regex";
import { PixDataDto } from "../pix-data";

export class PatchOneReceiverDto {
	@Min(1)
	@IsPositive()
	@ApiProperty({
		description: "The id of the receiver",
		example: 1,
		required: true,
	})
	id: number;

	@ApiProperty({
		description: "Receiver email",
		example: "JHON_DOE@EXAMPLE.COM",
	})
	@Matches(UPPERCASE_EMAIL_SCHEMA, {
		message: a => a.property + ": Invalid email. Format: 'A@B.COM'",
	})
	@MaxLength(250)
	@IsOptional()
	email?: string;

	@ApiProperty({ description: "Receiver name", example: "Jhon Doe" })
	@IsNotEmpty()
	@IsString()
	@IsOptional()
	completed_name?: string;

	@ApiProperty({
		description: "Receiver CPF or CNPJ",
		example: "719.805.580-00 or 53.803.780/0001-74",
	})
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@Matches(CNPJ_AND_CPF_SCHEMA, {
		message: a =>
			a.property + ": Invalid CPF or CNPJ. Format: XXX.XXX.XXX-XX or XX.XXX.XXX/XXXX-XX",
	})
	cpf_cnpj?: string;

	@ApiProperty({
		description: "Data of pix key",
		example: {
			pix_key_type: "CPF",
			pix_key: "719.805.580-00",
		},
	})
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@IsNotEmptyObject()
	@Type(() => PixDataDto)
	pix_data?: PixDataDto;
}
