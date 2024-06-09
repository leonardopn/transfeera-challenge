import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { PatchOneReceiverDto } from "./patch-one-receiver.dto";

describe("PatchOneReceiverDto", () => {
	describe("id field", () => {
		it("should be valid when the field is positive and greater than 0", async () => {
			const testFields = [1, 2, 3, 4, 5, 6, 7];

			for (const field of testFields) {
				const myBodyObject = { id: field };
				const myDtoObject = plainToInstance(PatchOneReceiverDto, myBodyObject);

				const errors = await validate(myDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});

		it("should be invalid when the field is 0 or negative ", async () => {
			const testFields = [-1, 0, -2, -3, -4, -5, -6, -7];

			for (const field of testFields) {
				const myBodyObject = { id: field };
				const myDtoObject = plainToInstance(PatchOneReceiverDto, myBodyObject);

				const errors = await validate(myDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});

		it("should be check if the field is a number", async () => {
			const testFields = [
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"NaN",
				NaN,
				true,
				false,
				{},
				[],
				"test",
			];

			for (const field of testFields) {
				const myBodyObject = { id: field };
				const myDtoObject = plainToInstance(PatchOneReceiverDto, myBodyObject);

				const errors = await validate(myDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});
	});

	describe("email field", () => {
		it("should check if the field is a no empty string", async () => {
			const testFields = [1, "", true, false, {}, []];

			for (const field of testFields) {
				const myBodyObject = { email: field };
				const myDtoObject = plainToInstance(PatchOneReceiverDto, myBodyObject);

				const errors = await validate(myDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});

		it("should check if the field is optional", async () => {
			const testFields = [undefined, null];

			for (const field of testFields) {
				const myBodyObject = { email: field };
				const myDtoObject = plainToInstance(PatchOneReceiverDto, myBodyObject);

				const errors = await validate(myDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});

		it("should be invalid if emails's length is greater than 250", async () => {
			const email = "a".repeat(241) + "@gmail.com";

			const myBodyObject = { email };
			const myDtoObject = plainToInstance(PatchOneReceiverDto, myBodyObject);

			const errors = await validate(myDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});

		it("should check if email is not valid", async () => {
			const invalidEmails = ["", "test", "test@", "bC6P1@example.com", "a@gmail.com"];

			for (const email of invalidEmails) {
				const invalidBodyObject = { email };
				const invalidDtoObject = plainToInstance(PatchOneReceiverDto, invalidBodyObject);
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
				const validDtoObject = plainToInstance(PatchOneReceiverDto, validBodyObject);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});

		it("should check if the field is not a string", async () => {
			const invalidBodyObject = { email: 3 };
			const invalidDtoObject = plainToInstance(PatchOneReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});
	});

	describe("completed_name", () => {
		it("should check if the field is empty", async () => {
			const invalidBodyObject = { completed_name: "" };
			const invalidDtoObject = plainToInstance(PatchOneReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});

		it("should check if the field is not a string", async () => {
			const invalidBodyObject = { completed_name: 3 };
			const invalidDtoObject = plainToInstance(PatchOneReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});

		it("should check if the field is optional", async () => {
			const invalidBodyObject = { completed_name: undefined };
			const invalidDtoObject = plainToInstance(PatchOneReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(0);
		});
	});

	describe("cpf_cnpj", () => {
		it("should check if the field is empty", async () => {
			const invalidBodyObject = { cpf_cnpj: "" };
			const invalidDtoObject = plainToInstance(PatchOneReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(1);
		});

		it("should check if the field is optional", async () => {
			const invalidBodyObject = { cpf_cnpj: undefined };
			const invalidDtoObject = plainToInstance(PatchOneReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(0);
		});

		it("should check if the field is not a string", async () => {
			const invalidBodyObject = { cpf_cnpj: true };
			const invalidDtoObject = plainToInstance(PatchOneReceiverDto, invalidBodyObject);
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
				const validDtoObject = plainToInstance(PatchOneReceiverDto, validBodyObject);
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
				const validDtoObject = plainToInstance(PatchOneReceiverDto, validBodyObject);
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
				const validDtoObject = plainToInstance(PatchOneReceiverDto, validBodyObject);
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
				const validDtoObject = plainToInstance(PatchOneReceiverDto, validBodyObject);
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
			];

			for (const field of validInputs) {
				const validDtoObject = plainToInstance(PatchOneReceiverDto, field);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});

		it("should check if the field is optional", async () => {
			const invalidBodyObject = { pix_data: undefined };
			const invalidDtoObject = plainToInstance(PatchOneReceiverDto, invalidBodyObject);
			const errors = await validate(invalidDtoObject, { skipMissingProperties: true });

			expect(errors.length).toBe(0);
		});

		it("should be valid for all valid options", async () => {
			//NOTE: PixDataDto has been tested in pix-data.dto.spec.ts, so this use case only need to test if the data is passed as object

			const validInputs = [
				{
					pix_data: {
						pix_key_type: "CPF",
						pix_key: "111.111.111-11",
					},
				},
			];

			for (const field of validInputs) {
				const validDtoObject = plainToInstance(PatchOneReceiverDto, field);
				const errors = await validate(validDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});
	});
});
