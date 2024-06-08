import { ApiProperty } from "@nestjs/swagger";
import {
	IsIn,
	MaxLength,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import {
	CNPJ_SCHEMA,
	CPF_SCHEMA,
	EMAIL_SCHEMA,
	PHONE_NUMBER_SCHEMA,
	UUID_V4_SCHEMA,
} from "../../constant/regex";
import { PixKeyType, PIX_KEY_TYPES } from "src/constant/PixKeyType";

@ValidatorConstraint({ name: "pix_key", async: false })
class PixKeyValidation implements ValidatorConstraintInterface {
	validate(text: string, args: ValidationArguments) {
		const { pix_key_type } = args.object as { pix_key_type: PixKeyType };

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
		const { pix_key_type } = args.object as { pix_key_type: PixKeyType };

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

export class PixDataDto {
	@ApiProperty({
		description: "Type of the pix key",
		enum: PIX_KEY_TYPES,
	})
	@IsIn(PIX_KEY_TYPES)
	pix_key_type: PixKeyType;

	@ApiProperty({
		description: "Pix key",
	})
	@MaxLength(140)
	@Validate(PixKeyValidation)
	pix_key: string;
}
