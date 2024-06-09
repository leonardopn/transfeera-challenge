import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsIn, IsString, MaxLength, Validate } from "class-validator";
import { PIX_KEY_TYPES, PixKeyType } from "../../constant/PixKeyType";
import { PixKeyValidation } from "../validations/pixKey.validation";

export class PixDataDto {
	@ApiProperty({
		description: "Type of the pix key",
		enum: PIX_KEY_TYPES,
	})
	@IsIn(PIX_KEY_TYPES)
	@IsDefined()
	pix_key_type: PixKeyType;

	@ApiProperty({
		description: "Pix key",
	})
	@MaxLength(140)
	@IsString()
	@Validate(PixKeyValidation)
	pix_key: string;
}
