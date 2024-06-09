import { plainToInstance } from "class-transformer";
import { CreateReceiverDto } from "./create-receiver.dto";
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
});
