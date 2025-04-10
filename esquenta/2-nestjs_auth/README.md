# FullCycle - NestJS Authentication Project

Este projeto é focado na implementação de autenticação e autorização.

## 🚀 Tecnologias

- NestJS
- PostgreSQL
- Prisma ORM
- Docker
- TypeScript
- JWT Authentication
- CASL para autorização

## 📋 Pré-requisitos

- Node.js
- Docker e Docker Compose
- pnpm (gerenciador de pacotes)

## 🔧 Instalação e Execução

1. Acesse o repositório

```bash
cd esquenta/nestjs_auth
```

2. Instale as dependências

```bash
pnpm i
```

3. Execute a infraestrutura e prepare o banco de dados

```bash
pnpm infra
```

Este comando irá:

- Iniciar o container do PostgreSQL
- Executar as migrações do Prisma
- Popular o banco com dados iniciais (seed)

4. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

Este comando irá:

- Copiar o .env.example para .env caso ele não exista
- Executar a aplicação em modo watch

O servidor estará rodando em `http://localhost:4000`

##

- [Nest.js e API REST: Autenticação e Autorização na Prática](https://www.youtube.com/watch?v=_ZyX4Vcofek)
