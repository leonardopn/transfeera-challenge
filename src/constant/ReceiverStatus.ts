/**
 * Array with all options of a receiver status
 */
export const RECEIVER_STATUS = ["Validado", "Rascunho"] as const;

/**
 * Types of a receiver status
 */
export type ReceiverStatus = (typeof RECEIVER_STATUS)[number];
