import { Receiver } from "@prisma/client";

export type ReceiverStatus = "Rascunho" | "Validado";

export type PixKeyType = "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "CHAVE_ALEATORIA";

export interface IReceiver extends Omit<Receiver, "status" | "pix_key_type"> {
	status: ReceiverStatus;
	pix_key_type: PixKeyType;
}

export interface IUpgradeReceiver extends Partial<IReceiver> {
	id: number;
}
