# Desafio Transfeera

## Sumário

-   [Sobre](#sobre)
-   [Executando Localmente](#executando-localmente)
-   [Acesso ao Banco de Dados](#acesso-ao-banco-de-dados)
-   [Testando o Aplicativo](#testando-o-aplicativo)
-   [Observações](#observações)
-   [Criador](#criador)
-   [Licença](#licença)

## Sobre

Este é um projeto desenvolvido como desafio para a Transfeera. Ele foi construído utilizando o framework [Nest](https://github.com/nestjs/nest) com TypeScript.

## Executando Localmente

-   Clone o repositório em sua máquina usando git.

```bash
git clone https://github.com/leonardopn/transfeera-challenge.git && cd transfeera-challenge
```

-   Instale o [Node.js](https://nodejs.org/en/download/package-manager) utilizando o método de sua preferência.

-   Instale o yarn para utilizar a versão padronizada no projeto

```bash
npm install --global yarn
```

-   Instale as dependências

```bash
yarn install
```

-   Crie um arquivo .env seguindo os conteúdo de [.env.example](./.env.example). Para uma inicialização rápida, use o seguinte esquema:

```yml
# NODE
NODE_ENV="development"

# PORT
PORT=4000

# PRISMA
DATABASE_URL="file:./database/index.db"
```

-   Execute a migração do banco de dados local

```bash
yarn prisma:migrate
```

-   Inicie a API localmente:

```bash
yarn start:dev
```

-   Acesse a documentação Swagger em: [`http://localhost:4000/api`](http://localhost:4000/api)

-   Utilize a interface do Swagger para testar as rotas.

## Acesso ao Banco de Dados

Para fins de desenvolvimento, optei pelo uso do [SQLite](https://sqlite.org/) e do [ORM Prisma](https://www.prisma.io/).
Se você seguiu corretamente os passos para desenvolvimento local, o banco de dados estará acessível [neste arquivo](./prisma/database/index.db). Sempre que desejar redefinir o banco de dados, basta excluir o arquivo gerado e executar `yarn prisma:migrate` novamente.

Ao executar `yarn prisma:migrate`, a aplicação criará o banco de dados local e o preencherá com 30 entradas aleatórias seguindo as regras de negócio. Se notar que os dados não foram gerados, execute o comando: `yarn prisma db seed`

Se desejar acessar os dados do banco de dados por meio de uma interface, pode usar o [Prisma Studio](https://www.prisma.io/studio), que já está configurado na aplicação, executando o seguinte comando: `yarn prisma:studio`

## Testando o Aplicativo

A aplicação utiliza a biblioteca jest para realizar testes de integração e unitários. Para executar todos os testes da aplicação, siga os passos abaixo:

1. _Testes de integração (e2e)_: `yarn test:e2e`
2. _Testes de unidade_: `yarn test`
3. _Validar cobertura_: `yarn test:cov`

> `ATENÇÃO`: Durante os testes de integração, um banco de dados de teste é gerado e excluído após a conclusão dos testes.

> `ATENÇÃO 2`: Alguns módulos do nest e testes E2E aparecem na listagem de cobertura, mas não há necessidade de testá-los. Foco em manter um alto grau de teste nas validações, serviços e controladores.

## Observações

Gostei bastante de desenvolver a aplicação e implementei as regras de negócio da melhor maneira possível. Utilizei padrões de injeção de dependência e separação em módulos fornecidos na própria estrutura do Nest, então é simples adicionar novas funcionalidades ou modificar regras e validações.

Durante o desenvolvimento, tentei focar em utilizar ao máximo tudo que foi fornecido no teste, porém, notei que algumas validações de regex poderiam ser melhoradas, como por exemplo validação de poucos padrões de CPF e CNPJ ou a validação de email que aceita padrões errados de email ao meu ver. No entanto, como disse, foquei em usar o que foi fornecido e, é claro, há sempre a possibilidade de melhoria e modificação, já que deixei bem simples para tanto modificar e testar novamente.

Notei também que nos mockups do desafio, haviam dados bancários como conta, agência, banco e etc. Por não estarem em nenhuma validação ou regra de negócio, preferi não adicioná-los por conta da falta de informação, podendo comprometer outras regras de negócio do sistema. Em um ambiente empresarial, problemas com regex ou falta de informação dos requisitos eu provavelmente iria atrás para alinharmos as regras de negócio.

Toda estrutura, variáveis e funcionalidade que fiz, foram escritas em inglês, pois acredito ser uma boa língua para universalizar o projeto e evitar ambiguidades da lingua portuguesa.

## Criador

-   Leonardo Petta do Nascimento
-   <leonardocps9@gmail.com>
-   [Linkedin](https://www.linkedin.com/in/leonardo-petta-do-nascimento-75674015b/)
-   [Site Pessoal](https://www.leonardopetta.dev/)

## Licença

O projeto está licenciado sob a [Licença MIT](./LICENSE.md).
