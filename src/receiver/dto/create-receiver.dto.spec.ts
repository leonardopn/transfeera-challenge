import { plainToInstance } from "class-transformer";
import { CreateReceiverDto } from "./create-receiver.dto";
import { validate } from "class-validator";

describe("CreateReceiverDto", () => {
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
			const invalidBodyObject1 = { email };
			const invalidDtoObject1 = plainToInstance(CreateReceiverDto, invalidBodyObject1);
			const errors = await validate(invalidDtoObject1, { skipMissingProperties: true });

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
			const validBodyObject1 = { email };
			const validDtoObject1 = plainToInstance(CreateReceiverDto, validBodyObject1);
			const errors = await validate(validDtoObject1, { skipMissingProperties: true });

			expect(errors.length).toBe(0);
		}
	});
});
