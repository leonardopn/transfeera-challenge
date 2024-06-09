import { plainToInstance } from "class-transformer";
import { CreateReceiverDto } from ".";
import { validate } from "class-validator";

describe("CreateReceiverDto", () => {
	describe("email", () => {
		it("should be invalid if emails's length is greater than 250", async () => {
			const email = "a".repeat(241) + "@gmail.com";

			const myBodyObject = { email };
			const myDtoObject = plainToInstance(CreateReceiverDto, myBodyObject);

			const errors = await validate(myDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});

		it("should be valid if email is omitted", async () => {
			const myBodyObject = { email: undefined };
			const myDtoObject = plainToInstance(CreateReceiverDto, myBodyObject);

			const errors = await validate(myDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(0);
		});

		it("should check if email is not valid", async () => {
			const invalidEmails = ["", "test", "test@", "bC6P1@example.com", "a@gmail.com"];

			for (const email of invalidEmails) {
				const invalidBodyObject = { email };
				const invalidDtoObject = plainToInstance(CreateReceiverDto, invalidBodyObject);
				const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});

		it("should check if email is valid", async () => {
			const validEmails = [
				"LEONARDO@EXAMPLE.COM",
				"A@A.BR",
				"A.S.D.S@G",
				"A.B.C.D@EXAMPLE.COM",
				"ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIKLMNOPQRSTUVWXYZABCDEFGHIKLMNOPQRSTUVWXYZ@EXAMPLE.COM",
				"ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIKLMNOPQRSTUVWXYZABCDEFGHIKLMNOPQRSTUVWXYZ@EXAMPLE.COM.BR",
				"A+B@EXAMPLE.COM",
				"A_B@EXAMPLE.COM",
				"A_B+C@EXAMPLE.COM",
				"A.B@EXAMPLE.CO.UK",
				"A.B@EXAMPLE.MUSEUM",
				"A.B@EXAMPLE.TRAVEL",
				"A.B@EXAMPLE.MOBI",
				"A.B@EXAMPLE.DESIGN",
				"A.B@EXAMPLE.PHOTOGRAPHY",
				"A.B@EXAMPLE.MARKETING",
				"A.B@EXAMPLE.CONSULTING",
				"A.B@EXAMPLE.VENTURES",
				"A.B@EXAMPLE.VENTURES.CO",
				"A.B@EXAMPLE.VENTURES.CO.UK",
				"A.B@EXAMPLE.VENTURES.IO",
				"A.B@EXAMPLE.VENTURES.TECH",
			];

			for (const email of validEmails) {
				const validBodyObject = { email };
				const validDtoObject = plainToInstance(CreateReceiverDto, validBodyObject);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});

		it("should check if the field is not a string", async () => {
			const invalidBodyObject = { email: 3 };
			const invalidDtoObject = plainToInstance(CreateReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});
	});

	describe("completed_name", () => {
		it("should check if the field is empty", async () => {
			const invalidBodyObject = { completed_name: "" };
			const invalidDtoObject = plainToInstance(CreateReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});

		it("should check if the field is not a string", async () => {
			const invalidBodyObject = { completed_name: 3 };
			const invalidDtoObject = plainToInstance(CreateReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});
	});

	describe("cpf_cnpj", () => {
		it("should check if the field is empty", async () => {
			const invalidBodyObject = { cpf_cnpj: "" };
			const invalidDtoObject = plainToInstance(CreateReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});
		it("should check if the field is not a string", async () => {
			const invalidBodyObject = { cpf_cnpj: true };
			const invalidDtoObject = plainToInstance(CreateReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});

		it("should check if the field is a correct CPF", async () => {
			const validInputs = [
				"111.111.111-11",
				"222.222.222-22",
				"333.333.333-33",
				"444.444.444-44",
				"98765432109",
				"87654321098",
				"01234567890",
				"54321098765",
			];

			for (const cpf_cnpj of validInputs) {
				const validBodyObject = { cpf_cnpj };
				const validDtoObject = plainToInstance(CreateReceiverDto, validBodyObject);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});

		it("should check if the field is a wrong CPF", async () => {
			const validInputs = [
				"111111111115",
				"2222222222",
				"33333333333s",
				"44444444444-",
				"-55555555555",
				"66666666666.",
				"77777777777.0",
				"88888888888-9",
			];

			for (const cpf_cnpj of validInputs) {
				const validBodyObject = { cpf_cnpj };
				const validDtoObject = plainToInstance(CreateReceiverDto, validBodyObject);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});

		it("should check if the field is a correct CNPJ", async () => {
			const validInputs = [
				"11111111000111",
				"22222222000222",
				"33333333000333",
				"44444444000444",
				"11.111111/0001-11",
				"22.222222/0002-22",
				"33.333333/0003-33",
				"44.444444/0004-44",
			];

			for (const cpf_cnpj of validInputs) {
				const validBodyObject = { cpf_cnpj };
				const validDtoObject = plainToInstance(CreateReceiverDto, validBodyObject);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});

		it("should check if the field is a wrong CNPJ", async () => {
			const validInputs = [
				"111111110001112",
				"22222222000222a",
				"33333333000333.",
				"444444440004449",
				"11.111111/00011",
				"22.222222/0002-",
				"33.333333/0003s",
				"44.444444/0004..",
			];

			for (const cpf_cnpj of validInputs) {
				const validBodyObject = { cpf_cnpj };
				const validDtoObject = plainToInstance(CreateReceiverDto, validBodyObject);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});
	});

	describe("pix_data", () => {
		it("should be invalid for all invalid options", async () => {
			const validInputs = [
				{ pix_data: {} },
				{ pix_data: 1 },
				{ pix_data: true },
				{ pix_data: false },
				{ pix_data: "test" },
				{ pix_data: null },
				{ pix_data: undefined },
			];

			for (const field of validInputs) {
				const validDtoObject = plainToInstance(CreateReceiverDto, field);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});
		it("should be valid for all valid options", async () => {
			//NOTE: PixDataDto has been tested in pix-data.spec.ts, so this use case only need to test if the data is passed as object

			const validInputs = [
				{
					pix_data: {
						pix_key_type: "CPF",
						pix_key: "111.111.111-11",
					},
				},
			];

			for (const field of validInputs) {
				const validDtoObject = plainToInstance(CreateReceiverDto, field);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});
	});
});
