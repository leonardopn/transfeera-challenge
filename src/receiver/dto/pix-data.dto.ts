import { ApiProperty } from "@nestjs/swagger";
import { IsIn, MaxLength, Validate } from "class-validator";
import { PixKeyType, PIX_KEY_TYPES } from "../../constant/PixKeyType";
import { PixKeyValidation } from "../validations/pixKey.validation";

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
