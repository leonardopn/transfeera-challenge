import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	HttpCode,
	Param,
	Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { isNegative, isNumber } from "class-validator";
import { CreateReceiverDto } from "./dto/create-receiver.dto";
import { ReceiverService } from "./receiver.service";
import { DeleteManyReceiversDto } from "./dto/delete-many-receivers.dto";

@Controller("receiver")
@ApiTags("Receiver")
export class ReceiverController {
	constructor(private readonly receiverService: ReceiverService) {}

	@Post()
	@ApiOperation({ summary: "Create a new receiver" })
	createOne(@Body() data: CreateReceiverDto) {
		return this.receiverService.createOne(data);
	}

	@Delete(":id")
	@ApiOperation({ summary: "Delete a receiver" })
	@HttpCode(204)
	async removeOne(@Param("id") id: number) {
		if (!isNumber(id) || isNegative(id)) {
			throw new BadRequestException("Id must be a positive number");
		}

		await this.receiverService.removeOne(id);
	}

	@Delete()
	@ApiOperation({ summary: "Delete many receivers" })
	@HttpCode(204)
	async removeMany(@Body() data: DeleteManyReceiversDto) {
		await this.receiverService.removeMany(data.ids);
	}
}
