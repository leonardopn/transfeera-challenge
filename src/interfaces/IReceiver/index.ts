import { Receiver } from "@prisma/client";
import { PixKeyType } from "../../constant/PixKeyType";
import { ReceiverStatus } from "../../constant/ReceiverStatus";

export interface IReceiver extends Omit<Receiver, "status" | "pix_key_type"> {
	status: ReceiverStatus;
	pix_key_type: PixKeyType;
}

export interface IUpgradeReceiver extends Partial<IReceiver> {
	id: number;
}
