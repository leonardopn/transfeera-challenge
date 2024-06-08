/**
 * Regex to validate a CPF pattern
 */
export const CPF_SCHEMA = /^[0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2}$/;

/**
 * Regex to validate a CNPJ pattern
 */
export const CNPJ_SCHEMA = /^[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}$/;

/**
 * Regex to validate a CNPJ or a CPF pattern
 */
export const CNPJ_AND_CPF_SCHEMA = new RegExp(
	"(" + CNPJ_SCHEMA.source + ")|(" + CPF_SCHEMA.source + ")"
);

/**
 * Regex to validate a phone pattern
 */
export const PHONE_NUMBER_SCHEMA = /^[a-z0-9+_.-]+@[a-z0-9.-]+$/;

/**
 * Regex to validate an email pattern
 */
export const EMAIL_SCHEMA = /^[a-z0-9+_.-]+@[a-z0-9.-]+$/;

/**
 * Regex to validate an UUID V4 pattern
 */
export const UUID_V4_SCHEMA = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
