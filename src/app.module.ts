import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { EnvModule } from "./env/env.module";
import { ReceiverModule } from "./receiver/receiver.module";

@Module({
	imports: [EnvModule, DatabaseModule, ReceiverModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
