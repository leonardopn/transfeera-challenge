import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { isNegative, isNumber } from "class-validator";
import { CreateReceiverDto } from "./dto/create-receiver";
import { RemoveManyReceiversDto } from "./dto/remove-many-receivers";
import { PatchOneReceiverDto } from "./dto/patch-one-receiver";
import { SearchReceiversDto } from "./dto/search-receivers";
import { ReceiverService } from "./receiver.service";

@Controller("receiver")
@ApiTags("Receiver")
export class ReceiverController {
	constructor(private readonly receiverService: ReceiverService) {}

	@Get()
	@ApiOperation({ summary: "Search receivers by query" })
	async search(@Query() data: SearchReceiversDto) {
		return this.receiverService.search(data.q, data.page);
	}

	@Post()
	@ApiOperation({ summary: "Create a new receiver" })
	@HttpCode(201)
	createOne(@Body() data: CreateReceiverDto) {
		return this.receiverService.createOne(data);
	}

	@Patch()
	@ApiOperation({ summary: "Patch a receiver" })
	async patchOne(@Body() data: PatchOneReceiverDto) {
		return this.receiverService.patchOne(data);
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
	async removeMany(@Body() data: RemoveManyReceiversDto) {
		await this.receiverService.removeMany(data.ids);
	}
}
