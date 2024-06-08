import { Receiver } from "@prisma/client";

export type ReceiverStatus = "Rascunho" | "Validado";

export interface IReceiver extends Omit<Receiver, "status"> {
	status: ReceiverStatus;
}

export interface IUpgradeReceiver extends Partial<IReceiver> {
	id: number;
}
