import { ApiProperty } from "@nestjs/swagger";
import {
	IsIn,
	IsNotEmpty,
	IsPositive,
	Matches,
	MaxLength,
	Min,
	IsOptional,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	IsObject,
	ValidateNested,
	IsNotEmptyObject,
} from "class-validator";
import { CreateReceiverDto } from "./create-receiver.dto";
import { Type } from "class-transformer";
import {
	CNPJ_AND_CPF_SCHEMA,
	CNPJ_SCHEMA,
	CPF_SCHEMA,
	EMAIL_SCHEMA,
	PHONE_NUMBER_SCHEMA,
	UUID_V4_SCHEMA,
} from "src/constant/regex";

type PixKeyType = "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "CHAVE_ALEATORIA";

@ValidatorConstraint({ name: "pix_key", async: false })
export class PixKeyValidation implements ValidatorConstraintInterface {
	validate(text: string, args: ValidationArguments) {
		const { pix_key_type } = args.object as CreateReceiverDto;

		switch (pix_key_type) {
			case "CPF":
				return CPF_SCHEMA.test(text);
			case "CNPJ":
				return CNPJ_SCHEMA.test(text);
			case "EMAIL":
				return EMAIL_SCHEMA.test(text);
			case "TELEFONE":
				return PHONE_NUMBER_SCHEMA.test(text);
			case "CHAVE_ALEATORIA":
				return UUID_V4_SCHEMA.test(text);
			default:
				return false;
		}
	}

	defaultMessage(args: ValidationArguments) {
		const { pix_key_type } = args.object as CreateReceiverDto;

		switch (pix_key_type) {
			case "CPF":
				return args.property + ": Invalid PIX Key as CPF";
			case "CNPJ":
				return args.property + ": Invalid PIX Key as CNPJ";
			case "EMAIL":
				return args.property + ": Invalid PIX Key as Email";
			case "TELEFONE":
				return args.property + ": Invalid PIX Key as phone number";
			case "CHAVE_ALEATORIA":
				return args.property + ": Invalid PIX Key as aleatory key";
			default:
				return args.property + ": Invalid PIX Key by type";
		}
	}
}

class PixData {
	@ApiProperty({
		description: "Type of pix key",
		enum: ["CPF", "CNPJ", "EMAIL", "TELEFONE", "CHAVE_ALEATORIA"],
	})
	@IsIn(["CPF", "CNPJ", "EMAIL", "TELEFONE", "CHAVE_ALEATORIA"])
	pix_key_type!: PixKeyType;

	@ApiProperty({
		description: "Pix key",
	})
	@MaxLength(140)
	@Validate(PixKeyValidation)
	pix_key!: string;
}

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
		example: "jhon_doe@example.com",
	})
	@IsOptional()
	@Matches(EMAIL_SCHEMA, { message: a => a.property + ": Invalid email" })
	@MaxLength(250)
	email?: string;

	@ApiProperty({ description: "Receiver name", example: "Jhon Doe" })
	@IsNotEmpty()
	@IsOptional()
	completed_name?: string;

	@ApiProperty({
		description: "Receiver CPF or CNPJ",

		example: "719.805.580-00 or 53.803.780/0001-74",
	})
	@IsNotEmpty()
	@IsOptional()
	@Matches(CNPJ_AND_CPF_SCHEMA, { message: a => a.property + ": Invalid CPF or CNPJ" })
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
	@Type(() => PixData)
	pix_data?: PixData;
}
