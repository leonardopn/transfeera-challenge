import { ApiProperty } from "@nestjs/swagger";
import {
	IsIn,
	IsNotEmpty,
	Matches,
	MaxLength,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	Validate,
	IsOptional,
} from "class-validator";
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

export class CreateReceiverDto {
	@ApiProperty({
		description: "Receiver email",
		example: "jhon_doe@example.com",
		required: false,
	})
	@Matches(EMAIL_SCHEMA, { message: a => a.property + ": Invalid email" })
	@MaxLength(250)
	@IsOptional()
	email!: string;

	@ApiProperty({ description: "Receiver name", example: "Jhon Doe", required: true })
	@IsNotEmpty()
	completed_name!: string;

	@ApiProperty({
		description: "Receiver CPF or CNPJ",
		required: true,
		example: "719.805.580-00 or 53.803.780/0001-74",
	})
	@IsNotEmpty()
	@Matches(CNPJ_AND_CPF_SCHEMA, {
		message: a => a.property + ": Invalid CPF or CNPJ",
	})
	cpf_cnpj!: string;

	@ApiProperty({
		description: "Type of pix key",
		required: true,
		enum: ["CPF", "CNPJ", "EMAIL", "TELEFONE", "CHAVE_ALEATORIA"],
	})
	@IsIn(["CPF", "CNPJ", "EMAIL", "TELEFONE", "CHAVE_ALEATORIA"])
	pix_key_type!: PixKeyType;

	@ApiProperty({
		description: "Pix key",
		required: true,
	})
	@MaxLength(140)
	@Validate(PixKeyValidation)
	pix_key!: string;
}
