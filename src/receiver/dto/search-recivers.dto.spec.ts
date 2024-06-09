import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { SearchReceiversDto } from "./search-recivers.dto";

describe("SearchReceiversDto", () => {
	describe("q field", () => {
		it("should be set a default field if not provided", async () => {
			const testFields = [{ q: undefined }, { q: "" }, { q: null }];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(SearchReceiversDto, field);

				expect(myDtoObject.q).toBe("");
			}
		});

		it("should be pass if the field has a valid value", async () => {
			const testFields = [
				{ q: undefined },
				{ q: "" },
				{ q: null },
				{ q: "test" },
				{ q: "test test" },
			];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(SearchReceiversDto, field);
				const errors = await validate(myDtoObject, { skipMissingProperties: true });
				expect(errors.length).toBe(0);
			}
		});

		it("should check if the field is not a valid value", async () => {
			const testFields = [
				{ q: [] },
				{ q: {} },
				{ q: new Date() },
				{ q: 3 },
				{ q: true },
				{ q: false },
			];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(SearchReceiversDto, field);
				const errors = await validate(myDtoObject, { skipMissingProperties: true });
				expect(errors.length).toBe(1);
			}
		});
	});
	describe("page field", () => {
		it("should be set a default field if not provided", async () => {
			const testFields = [{ page: undefined }, { page: 1 }, { page: null }];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(SearchReceiversDto, field);

				expect(myDtoObject.page).toBe(1);
			}
		});

		it("should be pass if the field has a valid value", async () => {
			const testFields = [
				{ page: undefined },
				{ page: 1 },
				{ page: null },
				{ page: 1 },
				{ page: 4 },
				{ page: true },
			];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(SearchReceiversDto, field);
				const errors = await validate(myDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(0);
			}
		});

		it("should check if the field is not a valid value", async () => {
			const testFields = [
				{ page: false },
				{ page: {} },
				{ page: [] },
				{ page: 0 },
				{ page: -1 },
				{ page: NaN },
			];

			for (const field of testFields) {
				const myDtoObject = plainToInstance(SearchReceiversDto, field);
				const errors = await validate(myDtoObject, { skipMissingProperties: true });

				expect(errors.length).toBe(1);
			}
		});
	});
});
