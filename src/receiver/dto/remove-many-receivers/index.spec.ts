import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RemoveManyReceiversDto } from ".";

describe("RemoveManyReceiversDto", () => {
	describe("ids", () => {
		it("should be invalid if ids is empty", async () => {
			const myBodyObject = { ids: [] };
			const myDtoObject = plainToInstance(RemoveManyReceiversDto, myBodyObject);

			const errors = await validate(myDtoObject);

			expect(errors.length).toBe(1);
		});

		it("should be invalid if any id is negative", async () => {
			const myBodyObject = { ids: [1, 2, 3, 4, -5, 4, 5, 7] };
			const myDtoObject = plainToInstance(RemoveManyReceiversDto, myBodyObject);

			const errors = await validate(myDtoObject);

			expect(errors.length).toBe(1);
		});

		it("should be invalid if any id is repeated", async () => {
			const myBodyObject = { ids: [1, 2, 3, 4, 5, 4, 5, 7] };
			const myDtoObject = plainToInstance(RemoveManyReceiversDto, myBodyObject);

			const errors = await validate(myDtoObject);

			expect(errors.length).toBe(1);
		});

		it("should be invalid if any id isn't a number", async () => {
			const myBodyObject = { ids: [1, 2, 3, 4, true, {}, [], "test", 9] };
			const myDtoObject = plainToInstance(RemoveManyReceiversDto, myBodyObject);

			const errors = await validate(myDtoObject);

			expect(errors.length).toBe(1);
		});

		it("should be invalid if the field isn't an array", async () => {
			const myBodyObject = { ids: 2 };
			const myDtoObject = plainToInstance(RemoveManyReceiversDto, myBodyObject);

			const errors = await validate(myDtoObject);

			expect(errors.length).toBe(1);
		});

		it("should be valid if the field only has positive elements", async () => {
			const myBodyObject = { ids: [1, 2, 3, 4, 5, 6, 7] };
			const myDtoObject = plainToInstance(RemoveManyReceiversDto, myBodyObject);

			const errors = await validate(myDtoObject);

			expect(errors.length).toBe(0);
		});
	});
});
