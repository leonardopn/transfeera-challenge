import { ApiProperty } from "@nestjs/swagger";
import { PIX_KEY_TYPES, PixKeyType } from "../constant/PixKeyType";
import { IReceiver } from "../interfaces/IReceiver";
import { RECEIVER_STATUS, ReceiverStatus } from "../constant/ReceiverStatus";

export class Receiver implements IReceiver {
	@ApiProperty({
		description: "Receiver unique id",
	})
	id: number;

	@ApiProperty({
		description: "Receiver name",
		example: "John Doe",
	})
	completed_name: string;

	@ApiProperty({
		description: "Receiver email",
		default: "",
		example: "JOHN@EXAMPLE.COM",
	})
	email: string;

	@ApiProperty({
		description: "Receiver CPF or CNPJ",
		example: "473.234.678-22",
	})
	cpf_cnpj: string;

	@ApiProperty({
		description: "Date receiver was created",
	})
	created_at: Date;
	@ApiProperty({
		description: "Date receiver was updated",
	})
	updated_at: Date;
	@ApiProperty({
		description: "Receiver status",
		enum: RECEIVER_STATUS,
	})
	status: ReceiverStatus;

	@ApiProperty({
		description: "Receiver pix key type",
		enum: PIX_KEY_TYPES,
	})
	pix_key_type: PixKeyType;

	@ApiProperty({
		description: "Receiver pix key",
		example: "473.234.678-22",
	})
	pix_key: string;
}
