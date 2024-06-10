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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { isNegative, isNumber } from "class-validator";
import { CreateReceiverDto } from "./dto/create-receiver";
import { RemoveManyReceiversDto } from "./dto/remove-many-receivers";
import { PatchOneReceiverDto } from "./dto/patch-one-receiver";
import { SearchReceiversDto } from "./dto/search-receivers";
import { ReceiverService } from "./receiver.service";
import { SearchServiceReturn } from "./types/searchReturn";

@Controller("receiver")
@ApiTags("Receiver")
export class ReceiverController {
	constructor(private readonly receiverService: ReceiverService) {}

	@Get()
	@ApiOperation({ summary: "Search receivers by query" })
	@ApiResponse({
		status: 200,
		description: "Search results",
		type: SearchServiceReturn,
	})
	@ApiResponse({
		status: 412,
		description: "Precondition Failed - page out of range",
		schema: {
			type: "object",
			properties: {
				message: { type: "string", example: "Page must be between 1 and 5" },
				error: { type: "string", example: "Precondition Failed" },
				statusCode: { type: "number", example: 412 },
			},
		},
	})
	@ApiResponse({
		status: 400,
		description: "Bad Request - wrong query",
		schema: {
			type: "object",
			properties: {
				message: { type: "string" },
				error: { type: "string", example: "Bad Request" },
				statusCode: { type: "number", example: 400 },
			},
		},
	})
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
