# Ília Wallet - Frontend

Frontend Next.js para o sistema de gerenciamento de transações financeiras.

## Stack

| Categoria     | Tecnologia                       | Justificativa                       |
| ------------- | -------------------------------- | ----------------------------------- |
| UI Components | **shadcn/ui + Tailwind CSS**     | Acessíveis, customizáveis, modernos |
| State/Cache   | **TanStack Query (React Query)** | Cache, invalidação, loading states  |
| Formulários   | **React Hook Form + Zod**        | Validação type-safe, performático   |
| i18n          | **next-intl**                    | Integração nativa com App Router    |
| HTTP Client   | **Axios**                        | Interceptors para JWT               |
| Testes Unit.  | **Vitest + Testing Library**     | Rápido, compatível com Jest API     |
| Testes E2E    | **Playwright**                   | Cross-browser, confiável            |
| Auth Storage  | **Cookies httpOnly**             | Segurança contra XSS                |

## Arquitetura

### BFF (Backend for Frontend)

O frontend utiliza Next.js API Routes como BFF, garantindo que o JWT nunca seja exposto ao navegador:

- **Login/Register**: API Routes chamam ms-users, definem cookie httpOnly com token
- **Transações**: API Routes leem token do cookie e fazem proxy para ms-wallet
- **Saldo**: Calculado a partir das transações no BFF

### Autenticação

1. Usuário faz login → `/api/auth/login`
2. Next.js chama `ms-users` e recebe token JWT
3. Token é armazenado em cookie httpOnly
4. Cliente recebe apenas dados do usuário (sem token)
5. Todas as requisições autenticadas passam pelo BFF que injeta o token

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz de `apps/web`:

```env
MS_USERS_URL=http://localhost:3002
MS_WALLET_URL=http://localhost:3001
```

## Pré-requisitos

- **Node.js** >= 18
- **pnpm** >= 9
- **ms-users** rodando na porta 3002
- **ms-wallet** rodando na porta 3001

## Instalação

```bash
# Na raiz do monorepo
pnpm install
```

## Desenvolvimento

```bash
# Rodar apenas o web
pnpm dev:web

# Ou rodar todos os serviços (web + microserviços)
pnpm dev
```

A aplicação estará disponível em: http://localhost:3000

## Build

```bash
pnpm build
```

## Testes

### Testes Unitários (Vitest)

```bash
pnpm test
```

### Testes E2E (Playwright)

```bash
# Certifique-se de que o app está rodando
pnpm dev

# Em outro terminal
pnpm test:e2e
```

## Estrutura de Pastas

```
apps/web/
├── app/                      # App Router
│   ├── (auth)/              # Rotas públicas (login, register)
│   ├── (dashboard)/         # Rotas protegidas (dashboard, transações)
│   ├── api/                 # BFF - API Routes
│   └── layout.tsx           # Layout raiz com providers
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── auth/                # Formulários de autenticação
│   ├── dashboard/           # Componentes do dashboard
│   ├── transactions/        # Componentes de transações
│   └── layout/              # Header, Sidebar, Footer
├── hooks/                   # Hooks customizados
├── lib/
│   ├── api/                 # Cliente Axios e chamadas
│   ├── auth/                # Contexto e cookie management
│   ├── utils/               # Helpers (formatação, etc)
│   └── validations/         # Schemas Zod
├── providers/               # Providers React (Query, Theme)
├── types/                   # Tipos TypeScript
└── i18n/                    # Internacionalização (pt-BR, en)
```

## Rotas

### Públicas

- `/login` - Login
- `/register` - Cadastro

### Protegidas

- `/dashboard` - Visão geral (saldo + transações recentes)
- `/transactions` - Lista completa de transações
- `/transactions/new` - Nova transação

## API Endpoints (BFF)

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Verificar sessão

### Transações

- `GET /api/transactions?type=CREDIT|DEBIT` - Listar transações
- `POST /api/transactions` - Criar transação
- `GET /api/balance` - Obter saldo

## Features

- ✅ Autenticação com JWT em cookies httpOnly
- ✅ Dashboard com saldo e transações recentes
- ✅ Listagem e criação de transações (CREDIT/DEBIT)
- ✅ Filtros por tipo de transação
- ✅ Internacionalização (pt-BR, en)
- ✅ Dark mode
- ✅ Validação de formulários com Zod
- ✅ Loading states e tratamento de erros
- ✅ Testes unitários e E2E

## Observações

1. **JWT_SECRET**: O `ms-users` e o `ms-wallet` devem usar o **mesmo** `JWT_SECRET` no `.env`, pois o token emitido no login (ms-users) é validado nas rotas do ms-wallet.

2. **CORS**: Como o frontend usa BFF (Next.js API Routes), não há chamadas diretas do navegador para os microserviços, eliminando problemas de CORS.

3. **Segurança**: O token JWT nunca é exposto ao cliente JavaScript, ficando armazenado em cookie httpOnly e acessível apenas pelas API Routes do Next.js.

4. **i18n**: O projeto usa um helper local (`lib/i18n-simple.ts`) em vez de `next-intl` para evitar incompatibilidade com Next.js 16. Os arquivos em `i18n/locales/` podem ser usados para expandir para múltiplos idiomas no futuro.

## Próximos Passos

- [ ] Adicionar refresh token
- [ ] Implementar paginação nas transações
- [ ] Adicionar gráficos de gastos
- [ ] Profile do usuário (edição)
- [ ] Histórico de transações com datas customizadas
