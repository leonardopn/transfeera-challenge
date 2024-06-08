import { Body, Controller, Post } from "@nestjs/common";
import { CreateReceiverDto } from "./dto/create-receiver.dto";
import { ReceiverService } from "./receiver.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("receiver")
@ApiTags("Receiver")
export class ReceiverController {
	constructor(private readonly receiverService: ReceiverService) {}

	@Post()
	@ApiOperation({ summary: "Create a new receiver" })
	createOne(@Body() data: CreateReceiverDto) {
		return this.receiverService.createOne(data);
	}
}
