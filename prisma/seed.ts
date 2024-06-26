import { Faker, base, en, pt_BR, pt_PT } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import { getRandomNumber } from "toolkit-extra/random";
import { fakerBr } from "@js-brasil/fakerbr";
import { PixKeyType } from "../src/constant/PixKeyType";

export const faker = new Faker({
	locale: [pt_BR, pt_PT, en, base],
});

const prisma = new PrismaClient();

function generateRandomCPF() {
	return fakerBr.cpf();
}

function generateRandomCNPJ() {
	return fakerBr.cnpj();
}

function generateRandomCellPhone() {
	return "+55" + String(fakerBr.celular()).replace(/\D/g, "");
}

async function main() {
	console.log(process.env.DATABASE_URL);
	const receiversToCreate: Prisma.ReceiverCreateManyInput[] = new Array(30).fill(0).map(() => {
		const pix_key_options: PixKeyType[] = [
			"CPF",
			"CNPJ",
			"EMAIL",
			"TELEFONE",
			"CHAVE_ALEATORIA",
		];
		const pix_key_index = getRandomNumber(0, 4);

		const pix_key = pix_key_options[pix_key_index];

		const pix_keys: { [key in PixKeyType]: { pix_key: string; pix_key_type: PixKeyType } } = {
			CPF: {
				pix_key: generateRandomCPF(),
				pix_key_type: "CPF",
			},
			CHAVE_ALEATORIA: {
				pix_key: faker.string.uuid(),
				pix_key_type: "CHAVE_ALEATORIA",
			},
			CNPJ: {
				pix_key: generateRandomCNPJ(),
				pix_key_type: "CNPJ",
			},
			EMAIL: {
				pix_key: faker.internet.email().toLowerCase(),
				pix_key_type: "EMAIL",
			},
			TELEFONE: {
				pix_key: generateRandomCellPhone(),
				pix_key_type: "TELEFONE",
			},
		};

		return {
			completed_name: faker.person.fullName(),
			cpf_cnpj: getRandomNumber(1, 2) === 1 ? generateRandomCPF() : generateRandomCNPJ(),
			email: getRandomNumber(1, 2) === 1 ? faker.internet.email().toUpperCase() : "",
			status: getRandomNumber(1, 2) === 1 ? "Validado" : "Rascunho",
			pix_key: pix_keys[pix_key].pix_key,
			pix_key_type: pix_keys[pix_key].pix_key_type,
		};
	});

	console.log(receiversToCreate);

	await prisma.receiver.createMany({
		data: receiversToCreate,
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
