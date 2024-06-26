import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";
import {
	CNPJ_SCHEMA,
	CPF_SCHEMA,
	LOWERCASE_EMAIL_SCHEMA,
	PHONE_NUMBER_SCHEMA,
	UUID_V4_SCHEMA,
} from "../../constant/regex";
import { PIX_KEY_TYPES, PixKeyType } from "../../constant/PixKeyType";

@ValidatorConstraint({ name: "pix_key", async: false })
export class PixKeyValidation implements ValidatorConstraintInterface {
	validate(text: string, args: ValidationArguments) {
		const { pix_key_type } = args.object as { pix_key_type: PixKeyType };

		switch (pix_key_type) {
			case "CPF":
				return CPF_SCHEMA.test(text);
			case "CNPJ":
				return CNPJ_SCHEMA.test(text);
			case "EMAIL":
				return LOWERCASE_EMAIL_SCHEMA.test(text);
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
				return args.property + ": Invalid PIX Key as CPF. Format: XXX.XXX.XXX-XX";
			case "CNPJ":
				return args.property + ": Invalid PIX Key as CNPJ. Format: XX.XXX.XXX/XXXX-XX";
			case "EMAIL":
				return args.property + ": Invalid PIX Key as Email. Format: 'a@b.com'";
			case "TELEFONE":
				return (
					args.property +
					": Invalid PIX Key as phone number. Format: '+5511999886854' or '11999886854'"
				);
			case "CHAVE_ALEATORIA":
				return (
					args.property +
					": Invalid PIX Key as aleatory key. Format: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'"
				);
			default:
				return (
					args.property + `: Invalid PIX Key by type. Any of: ${PIX_KEY_TYPES.join(", ")}`
				);
		}
	}
}
