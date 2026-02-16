# ília - Code Challenge NodeJS

---

## Project overview (solution)

This repository is a **monorepo** implementing the ília Node.js challenge: a financial wallet with two NestJS microservices and a Next.js frontend.

| Application   | Stack           | Port (HTTP) | Description                          |
|----------------|-----------------|-------------|--------------------------------------|
| **web**       | Next.js 16      | 3000        | BFF + UI (auth, balance, transactions) |
| **ms-users**  | NestJS 11       | 3002        | Users, auth, gRPC server (50051)      |
| **ms-wallet** | NestJS 11       | 3001        | Transactions, balance, gRPC server (50052) |

- **Internal communication**: ms-users talks to ms-wallet via **gRPC** (JWT internal).
- **Databases**: PostgreSQL — one database per microservice (`ms_users`, `wallet`).
- **Shared packages**: `@ilia/grpc`, `@ilia/proto`, `@ilia/typescript-config`, `@ilia/eslint-config`.

### How to run

**Option 1 – Docker (all apps + Postgres)**

```bash
# From repo root
docker compose up -d
```

- **Web**: http://localhost:3000  
- **ms-users**: http://localhost:3002  
- **ms-wallet**: http://localhost:3001  
- **Postgres**: localhost:5432 (user `postgres`, password `postgres`). Databases `ms_users` and `wallet` are created on first run; Prisma runs `db push` when the services start.

If a port is already in use (e.g. 3000, 3001, 3002, 5432), stop the conflicting process or change the port in `docker-compose.yml`.

**Option 2 – Local (pnpm)**

1. **Node.js** ≥ 18, **pnpm** ≥ 9.
2. PostgreSQL: create databases `ms_users` and `wallet` (or use two instances on ports 5432 and 5433 as in the apps’ `.env.example`).
3. From repo root:

```bash
pnpm install
pnpm run proto:generate
# In apps/ms-users and apps/ms-wallet: set .env (see .env.example) and run `pnpm exec prisma db push`
pnpm dev          # all apps
# or
pnpm dev:services # only ms-users + ms-wallet
pnpm dev:web      # only Next.js
```

4. Open http://localhost:3000. Ensure `apps/web/.env.local` has `MS_USERS_URL=http://localhost:3002` and `MS_WALLET_URL=http://localhost:3001`.

**Scripts (root)**

| Script          | Description                    |
|-----------------|--------------------------------|
| `pnpm build`    | Build all apps and packages    |
| `pnpm dev`      | Run all apps in dev mode       |
| `pnpm test`     | Run tests in all workspaces   |
| `pnpm dev:web`  | Run only Next.js               |
| `pnpm dev:services` | Run only ms-users + ms-wallet |

---

## The Challenge:
One of the ília Digital verticals is Financial and to level your knowledge we will do a Basic Financial Application and for that we divided this Challenge in 2 Parts.

The first part is mandatory, which is to create a Wallet microservice to store the users' transactions, the second part is optional (*for Seniors, it's mandatory*) which is to create a Users Microservice with integration between the two microservices (Wallet and Users), using internal communications between them, that can be done in any of the following strategies: gRPC, REST, Kafka or via Messaging Queues and this communication must have a different security of the external application (JWT, SSL, ...), **Development in javascript (Node) is required.**

![diagram](diagram.png)

### General Instructions:
## Part 1 - Wallet Microservice

This microservice must be a digital Wallet where the user transactions will be stored 

### The Application must have

    - Project setup documentation (readme.md).
    - Application and Database running on a container (Docker, ...).
    - This Microservice must receive HTTP Request.
    - Have a dedicated database (Postgres, MySQL, Mongo, DynamoDB, ...).
    - JWT authentication on all routes (endpoints) the PrivateKey must be ILIACHALLENGE (passed by env var).
    - Configure the Microservice port to 3001. 
    - Gitflow applied with Code Review in each step, open a feature/branch, create at least one pull request and merge it with Main(master deprecated), this step is important to simulate a team work and not just a commit.

## Part 2 - Microservice Users and Wallet Integration

### The Application must have:

    - Project setup documentation (readme.md).
    - Application and Database running on a container (Docker, ...).
    - This Microservice must receive HTTP Request.   
    - Have a dedicated database(Postgres, MySQL, Mongo, DynamoDB...), you may use an Auth service like AWS Cognito.
    - JWT authentication on all routes (endpoints) the PrivateKey must be ILIACHALLENGE (passed by env var).
    - Set the Microservice port to 3002. 
    - Gitflow applied with Code Review in each step, open a feature/branch, create at least one pull request and merge it with Main(master deprecated), this step is important to simulate a teamwork and not just a commit.
    - Internal Communication Security (JWT, SSL, ...), if it is JWT the PrivateKey must be ILIACHALLENGE_INTERNAL (passed by env var).
    - Communication between Microservices using any of the following: gRPC, REST, Kafka or via Messaging Queues (update your readme with the instructions to run if using a Docker/Container environment).

## Part 3 - Frontend Implementation - Fullstack candidates only

In this challenge, you will build the frontend application for a FinTech Wallet platform, integrating with the backend microservices provided in the Node.js challenge.

The application must allow users to authenticate, view their wallet balance, list transactions, and create credit or debit operations. The goal is to evaluate your ability to design a modern, secure, and well-structured UI that consumes microservice APIs, handles authentication via JWT, and provides a solid user experience with proper loading, error, and empty states.

You may implement the solution using React, Vue, or Angular, following the required stack for the position you're running for and best practices outlined in the challenge.

### Before you start ⚠️

- **Create a separate folder for the Frontend project**
- Frontend must be built in **Typescript**.  
- The goal is to deliver a production-like UI that consumes the backend services:
  - Wallet Service (port **3001**)
  - Users Service (port **3002**, optional but mandatory for Senior)

### Challenge Overview

You will build a **web application** that allows a user to:

- Authenticate (if Users service exists)
- View wallet balance
- List transactions
- Create transactions (credit/debit)
- Handle loading, empty, and error states properly

### Design Guidelines

No visual prototype or UI mockups will be provided for this challenge on purpose. This is intentional so we can evaluate your product sense, design judgment, and ability to translate business requirements into a coherent user experience. You should focus on creating a clean, modern, and intuitive interface that prioritizes usability and clarity of financial information. Pay special attention to information hierarchy (for example, making balance visibility prominent), form usability and validation, transaction readability, and clear feedback for system states such as loading, success, and errors. Consistency in layout, spacing, typography, and component reuse is important, as well as responsiveness and accessibility basics. *We are not evaluating graphic design skills*, but rather your ability to craft a professional, production-ready UI that engineers and users would find reliable and easy to use.

Feel free to leverage on any opensource components library.

### Requirements 
This frontend should reflect real-world practices:
- secure JWT handling
- clean UX flows
- robust API integration
- scalable component structure
- test coverage where it matters
- supports i18n
- responsive design (supporting mobile browser)

#### In the end, send us your fork repo updated. As soon as you finish, please let us know.

#### We are available to answer any questions.


Happy coding! 🤓

---

## Visão geral do projeto (solução) — Português

Este repositório é um **monorepo** que implementa o desafio Node.js da ília: uma carteira financeira com dois microserviços NestJS e um frontend Next.js.

| Aplicação    | Stack        | Porta (HTTP) | Descrição                                      |
|-------------|--------------|--------------|------------------------------------------------|
| **web**     | Next.js 16   | 3000         | BFF + interface (auth, saldo, transações)     |
| **ms-users**| NestJS 11    | 3002         | Usuários, autenticação, servidor gRPC (50051) |
| **ms-wallet** | NestJS 11  | 3001         | Transações, saldo, servidor gRPC (50052)       |

- **Comunicação interna**: ms-users se comunica com ms-wallet via **gRPC** (JWT interno).
- **Bancos de dados**: PostgreSQL — um banco por microserviço (`ms_users`, `wallet`).

### Como rodar

**Opção 1 – Docker (todas as aplicações + Postgres)**

```bash
# Na raiz do repositório
docker compose up --build
```

- **Web**: http://localhost:3000  
- **ms-users**: http://localhost:3002  
- **ms-wallet**: http://localhost:3001  
- **Postgres**: localhost:5432 (usuário `postgres`, senha `postgres`). Os bancos `ms_users` e `wallet` são criados na primeira execução; o Prisma executa `db push` na subida dos serviços.

Se alguma porta já estiver em uso (ex.: 3000, 3001, 3002, 5432), pare o processo que a utiliza ou altere a porta no `docker-compose.yml`.

**Opção 2 – Local (pnpm)**

1. **Node.js** ≥ 18 e **pnpm** ≥ 9.
2. PostgreSQL: criar os bancos `ms_users` e `wallet` (ou usar duas instâncias nas portas 5432 e 5433 conforme os `.env.example` dos apps).
3. Na raiz do repositório:

```bash
pnpm install
pnpm run proto:generate
# Em apps/ms-users e apps/ms-wallet: configurar .env (ver .env.example) e rodar `pnpm exec prisma db push`
pnpm dev           # todos os apps
# ou
pnpm dev:services  # apenas ms-users + ms-wallet
pnpm dev:web       # apenas Next.js
```

4. Acessar http://localhost:3000. Em `apps/web/.env.local`, usar `MS_USERS_URL=http://localhost:3002` e `MS_WALLET_URL=http://localhost:3001`.
