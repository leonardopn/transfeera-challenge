import { Module } from "@nestjs/common";
import { ReceiverService } from "./receiver.service";
import { ReceiverController } from "./receiver.controller";

@Module({
	providers: [ReceiverService],
	controllers: [ReceiverController],
})
export class ReceiverModule {}
