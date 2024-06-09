import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { PixDataDto } from ".";
import { v4 } from "uuid";

describe("PixDataDto", () => {
	describe("pix_key_type field", () => {
		it("should be one of the valid values", async () => {
			const testFields = [
				{ pix_key_type: "CPF" },
				{ pix_key_type: "CNPJ" },
				{ pix_key_type: "EMAIL" },
				{ pix_key_type: "TELEFONE" },
				{ pix_key_type: "CHAVE_ALEATORIA" },
			];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(PixDataDto, field);

				const errors = await validate(myDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});

		it("should check if the field is not a valid value", async () => {
			const testFields = [
				{ pix_key_type: "" },
				{ pix_key_type: "CPFs" },
				{ pix_key_type: ["CPF"] },
				{ pix_key_type: 1 },
				{ pix_key_type: true },
				{ pix_key_type: {} },
				{ pix_key_type: { CPF: "CPF" } },
				{ pix_key_type: [] },
				{ pix_key_type: null },
				{ pix_key_type: undefined },
			];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(PixDataDto, field);

				const errors = await validate(myDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});
	});

	describe("pix_key field", () => {
		it("should be invalid if the field is greater than 140 characters", async () => {
			const myDtoObject = plainToInstance(PixDataDto, {
				pix_key: "l".repeat(131) + "@gmail.com",
				pix_key_type: "EMAIL",
			});

			const errors = await validate(myDtoObject, { skipMissingProperties: true });
			expect(errors.length).toBe(1);
		});

		it("should be valid for all valid options", async () => {
			const testFields = [
				{ pix_key_type: "CPF", pix_key: "47338204888" },
				{ pix_key_type: "CPF", pix_key: "473.382.048-88" },
				{ pix_key_type: "CPF", pix_key: "473382.048-88" },

				{ pix_key_type: "CNPJ", pix_key: "00.000.000/0001-00" },
				{ pix_key_type: "CNPJ", pix_key: "00.0000000001-00" },
				{ pix_key_type: "CNPJ", pix_key: "00000000000100" },

				{ pix_key_type: "EMAIL", pix_key: "a@b.com" },
				{ pix_key_type: "EMAIL", pix_key: "a@b." },
				{ pix_key_type: "EMAIL", pix_key: "a@b" },

				{ pix_key_type: "TELEFONE", pix_key: "+5519998868547" },
				{ pix_key_type: "TELEFONE", pix_key: "19998868547" },
				{ pix_key_type: "TELEFONE", pix_key: "5511999886854" },
				{ pix_key_type: "TELEFONE", pix_key: "11999886854" },
				{ pix_key_type: "TELEFONE", pix_key: "+5511999886854" },
				{ pix_key_type: "TELEFONE", pix_key: "5511999886854" },

				{ pix_key_type: "CHAVE_ALEATORIA", pix_key: v4() },
				{
					pix_key_type: "CHAVE_ALEATORIA",
					pix_key: "3b7a12de-5b19-4a4c-9935-4ce160524dcd",
				},
			];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(PixDataDto, field);

				const errors = await validate(myDtoObject);

				expect(errors.length).toBe(0);
			}
		});

		it("should be invalid for not mapped pix_key_type", async () => {
			const myDtoObject = plainToInstance(PixDataDto, {
				pix_key: "a@b.com",
			});

			const errors = await validate(myDtoObject);

			expect(errors.length).toBe(2);
			expect(errors.find(e => e.property === "pix_key")?.constraints?.pix_key).toContain(
				"Invalid PIX Key by type"
			);
		});

		it("should be invalid for all invalid options", async () => {
			const testFields = [
				{ pix_key_type: "", pix_key: "" },
				{ pix_key_type: "sad", pix_key: "" },
				{ pix_key: "asd" },
				{ pix_key_type: "sad" },
				{ pix_key_type: "CPF" },
				{},

				{ pix_key_type: "CPF", pix_key: "47338204888a" },
				{ pix_key_type: "CPF", pix_key: "" },
				{ pix_key_type: "CPF", pix_key: "1" },
				{ pix_key_type: "CPF", pix_key: "473.382.048-880" },

				{ pix_key_type: "CNPJ", pix_key: "00.000.000/00a1-00" },
				{ pix_key_type: "CNPJ", pix_key: "" },
				{ pix_key_type: "CNPJ", pix_key: "00000000f00100" },
				{ pix_key_type: "CNPJ", pix_key: "0000000000100" },
				{ pix_key_type: "CNPJ", pix_key: "00000000001000)" },

				{ pix_key_type: "EMAIL", pix_key: "a" },
				{ pix_key_type: "EMAIL", pix_key: "" },
				{ pix_key_type: "EMAIL", pix_key: "@" },
				{ pix_key_type: "EMAIL", pix_key: "a@" },
				{ pix_key_type: "EMAIL", pix_key: "A@" },
				{ pix_key_type: "EMAIL", pix_key: "TESTE@GMAIL.COM" },

				{ pix_key_type: "TELEFONE", pix_key: "+55 (19) 99886-8547" },
				{ pix_key_type: "TELEFONE", pix_key: "(19) 99886-8547" },
				{ pix_key_type: "TELEFONE", pix_key: "(19) 99886-8547" },
				{ pix_key_type: "TELEFONE", pix_key: "199988A8547" },
				{ pix_key_type: "TELEFONE", pix_key: "-5511999886854" },

				{ pix_key_type: "CHAVE_ALEATORIA", pix_key: v4() + "asd" },
				{ pix_key_type: "CHAVE_ALEATORIA", pix_key: "" },
				{ pix_key_type: "CHAVE_ALEATORIA", pix_key: v4().replaceAll("-", "") },
				{ pix_key_type: "CHAVE_ALEATORIA", pix_key: "3b7a12de5b194a4c99354ce160524dcd" },
			];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(PixDataDto, field);

				const errors = await validate(myDtoObject);

				expect(errors.length).toBeGreaterThanOrEqual(1);
				expect(errors.length).toBeLessThanOrEqual(2);
			}
		});
	});
});
