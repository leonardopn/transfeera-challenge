# Transfeera Challenge

## Sumário

-   [Sobre](#sobre)
-   [Rodando local](#rodando-local)
-   [Acesso ao banco de dados](#acesso-ao-banco-de-dados)
-   [Testando o App](#testando-o-app)
-   [Observações](#observações)
-   [Criador](#criador)
-   [Licença](#licença)

## Sobre

Este é um projeto desenvolvido como desafio para a Transfeera. Ele foi construído utilizando o [Nest](https://github.com/nestjs/nest) framework TypeScript.

## Rodando local

-   Clone o repositório em sua máquina usando git.

```bash
git clone https://github.com/leonardopn/transfeera-challenge.git && cd transfeera-challenge
```

-   Instale o [NODE](https://nodejs.org/en/download/package-manager) utilizando a forma que preferir.

-   Instale o yarn para utilizar a versão padronizada no projeto

```bash
npm install --global yarn
```

-   Instale as dependências

```bash
yarn install
```

-   Crie um arquivo .env seguindo os conteúdo de [.env.example](./.env.example). Para fins de um inicio rápido, utilize o schema abaixo:

```yml
# NODE
NODE_ENV="development"

# PORT
PORT=4000

# PRISMA
DATABASE_URL="file:./database/index.db"
```

-   Rode a geração do banco de dados local

```bash
yarn prisma:migrate
```

-   Rode a api localmente:

```bash
yarn start:dev
```

-   Acesse a documentação Swagger em: [`http://localhost:4000/api`](http://localhost:4000/api)

-   Utilize a interface do Swagger para testar as rotas.

## Acesso ao banco de dados

Para fins de desenvolvimento, optei pelo uso do [SQLite](https://sqlite.org/) e do [ORM Prisma](https://www.prisma.io/).
Se você seguiu corretamente os passos para desenvolvimento local, o banco de dados vai estar acessível [neste arquivo](./prisma/database/index.db). Sempre que quiser resetar o banco, basta apagar o arquivo gerado e rodar `yarn prisma:migrate`.

Ao executar `yarn prisma:migrate` a aplicação vai criar o banco de dados local e preenche-lo com 30 entradas aleatórias seguindo as regras de negócio. Caso note que os dados não foram gerados, rode o comando: `yarn prisma db seed`

Caso deseje acessar os dados do banco por uma interface, pode utilizar o [Prisma Studio](https://www.prisma.io/studio) que já está configurado na aplicação rodando o seguinte comando: `yarn prisma:studio`

## Testando o App

A aplicação utiliza a biblioteca jest para realizar os testes de integração e unitários. Para rodar todos os testes da aplicação siga os passos abaixo:

1. _Testes de integração(e2e)_: `yarn test:e2e`
2. _Testes de unidade_: `yarn test`
3. _Validar coverage_: `yarn test:cov`

> `ATENÇÃO`: Durante os testes de integração, um banco de dados de teste é gerado e apagado após o término dos testes.

> `ATENÇÃO 2`: Alguns módulos do nest e testes E2E aparecem na listagem de coverage, porém não há necessidade de testa-los. Foquei em manter um alto grau de teste nas validações, serviços e controladores.

## Observações

Gostei bastante de desenvolver a aplicação e implementei as regras de negócio da melhor maneira que pude. Utilizei padrões de injeção de dependência e separação em módulos fornecidos na própria estrutura do Nest, então é simples fazer a adição de novas funcionalidades ou modificar regras e validações.

Durante o desenvolvimento tentei focar em desenvolver utilizando ao máximo tudo que foi me fornecido no teste, porém notei que algumas validações de regex poderiam ser melhoradas como por exemplo validação de poucos padrões de CPF e CNPJ ou a validação de email que aceita padrões errados de email ao meu ver, porém, como disse, foquei em utilizar o quê me foi fornecido e é claro, há sempre a possibilidade de melhoria e modificação, já que deixei bem simples para tanto modificar e testar novamente.

Notei também que nos mockups do desafio, haviam dados bancários como conta, agência, banco e etc. Por não estarem em nenhuma validação ou regra de negócio, preferi não adiciona-los por conta da falta de informação, podendo comprometer outras regras de negócio do sistema. Em um ambiente empresarial, problemas com regex o falta de informação dos requisitos eu provavelmente iria atrás para alinharmos as regras de negócio.

Toda estrutura, variáveis e funcionalidade que fiz, foram escritas em inglês, pois acredito ser uma boa lingua para universalizar o projeto e evitar ambiguidades da lingua portuguesa.

A demais, espero que o sistema cumpra com o esperado, desenvolvi ele entre a sexta a noite e domingo a noite. É claro, também estou sempre disponível para fazer uma analise do código e responder quaisquer perguntas que tenham sobre ele.

## Criador

-   Leonardo Petta do Nascimento
-   <leonardocps9@gmail.com>
-   [Linkedin](https://www.linkedin.com/in/leonardo-petta-do-nascimento-75674015b/)
-   [Site Pessoal](https://www.leonardopetta.dev/)

## Licença

O projeto está licenciado por [MIT](./LICENSE.md)
