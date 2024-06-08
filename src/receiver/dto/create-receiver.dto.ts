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
} from "class-validator";

type PixKeyType = "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "CHAVE_ALEATORIA";

@ValidatorConstraint({ name: "pix_key", async: false })
export class PixKeyValidation implements ValidatorConstraintInterface {
	validate(text: string, args: ValidationArguments) {
		const { pix_key_type } = args.object as CreateReceiverDto;

		switch (pix_key_type) {
			case "CPF":
				return /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}$/.test(text);
			case "CNPJ":
				return /^[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}$/.test(text);
			case "EMAIL":
				return /^[a-z0-9+_.-]+@[a-z0-9.-]+$/.test(text);
			case "TELEFONE":
				return /^((?:\+?55)?)([1-9][0-9])(9[0-9]{8})$/.test(text);
			case "CHAVE_ALEATORIA":
				return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(text);
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
	@Matches(/^[a-z0-9+_.-]+@[a-z0-9.-]+$/, { message: a => a.property + ": Invalid email" })
	@MaxLength(250)
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
	@Matches(
		/^[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}$|^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}$/,
		{ message: a => a.property + ": Invalid CPF or CNPJ" }
	)
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
