/**
 * Array with all options of a pix key
 */
export const PIX_KEY_TYPES = ["CPF", "CNPJ", "EMAIL", "TELEFONE", "CHAVE_ALEATORIA"] as const;

/**
 * Types of a pix key
 */
export type PixKeyType = (typeof PIX_KEY_TYPES)[number];
