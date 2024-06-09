import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
	IsNotEmpty,
	IsNotEmptyObject,
	IsObject,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	ValidateNested,
} from "class-validator";
import { CNPJ_AND_CPF_SCHEMA, UPPERCASE_EMAIL_SCHEMA } from "../../../constant/regex";
import { PixDataDto } from "../pix-data";

export class CreateReceiverDto {
	@ApiProperty({
		description: "Receiver email",
		example: "JHON_DOE@EXAMPLE.COM",
		required: false,
	})
	@Matches(UPPERCASE_EMAIL_SCHEMA, {
		message: a => a.property + ": Invalid email. Use format: JHON_DOE@EXAMPLE.COM",
	})
	@MaxLength(250)
	@IsOptional()
	@IsString()
	email?: string;

	@ApiProperty({ description: "Receiver name", example: "Jhon Doe" })
	@IsNotEmpty()
	@IsString()
	completed_name: string;

	@ApiProperty({
		description: "Receiver CPF or CNPJ",
		example: "719.805.580-00 or 53.803.780/0001-74",
	})
	@Matches(CNPJ_AND_CPF_SCHEMA, {
		message: a =>
			a.property +
			": Invalid CPF or CNPJ. Use the formats: XXX.XXX.XXX-XX or XX.XXX.XXX/XXXX-XX",
	})
	@IsNotEmpty()
	@IsString()
	cpf_cnpj: string;

	@ApiProperty({
		description: "Data of pix key",
		example: {
			pix_key_type: "CPF",
			pix_key: "719.805.580-00",
		},
	})
	@IsObject()
	@ValidateNested()
	@IsNotEmptyObject()
	@Type(() => PixDataDto)
	@Transform(({ value }) => (!value ? {} : value))
	pix_data: PixDataDto;
}
