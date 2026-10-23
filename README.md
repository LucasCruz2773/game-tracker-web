# GameTrack Web

Frontend da aplicação GameTrack.

Backend: [game-tracker-api](https://github.com/LucasCruz2773/game-tracker-api).

## Stack

- React 19 + TypeScript
- Vite 8
- React Router 8
- TanStack Query 5
- Tailwind CSS 4

## Requisitos

- Node.js **24**
- API GameTrack rodando (ou proxy apontando para ela)

## Setup

```bash
npm install
npm run dev
```

App em `http://localhost:5173`.

O Vite faz proxy de `/api` → `http://localhost:3000` (mesmo origin para o cookie de sessão). Para outro host da API:

```bash
API_PROXY_TARGET=http://localhost:3100 npm run dev
```

## Scripts

| Comando             | Descrição                      |
| ------------------- | ------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento    |
| `npm run build`     | Build de produção              |
| `npm run preview`   | Preview do build               |
| `npm run typecheck` | Verificação TypeScript         |
| `npm run test`      | Testes unitários (Vitest)      |
| `npm run test:e2e`  | Testes end-to-end (Playwright) |
| `npm run lint`      | Oxlint                         |

## Rotas

| Rota             | Página                            |
| ---------------- | --------------------------------- |
| `/login`         | Login com Google                  |
| `/`              | Busca e jogos populares           |
| `/games/:gameId` | Detalhes, biblioteca e reviews    |
| `/library`       | Biblioteca com filtros por status |
| `/dashboard`     | Estatísticas da biblioteca        |

Rotas autenticadas passam por `RequireAuth`; sessão vem de `GET /api/auth/me`.

## Estrutura

```text
src/
├── app/              # router, layout
├── features/
│   ├── auth/
│   ├── games/
│   ├── library/
│   ├── reviews/
│   └── dashboard/
├── components/
├── lib/              # api-client, dates
└── pages/
```

Estado de servidor: TanStack Query. Sem Zustand global — apenas estado local de UI.

## Testes e2e

```bash
npm run test:e2e
```

O Playwright sobe automaticamente:

1. Servidor fake RAWG (porta 3200)
2. API em modo e2e (porta 3100, banco de teste)
3. Vite (porta 5199)

A API deve estar em `../game-tracker-api` (ou defina `GAMETRACK_API_DIR`). Os testes criam usuários via `e2e:session` na API, sem OAuth real.

UI em **português (pt-BR)**.

## Build

```bash
npm run build
```

Sirva os arquivos estáticos com qualquer host. Em produção, configure o reverse proxy para encaminhar `/api` à API real e defina `FRONTEND_URL` na API para o domínio do frontend.

Se frontend e API forem publicados em origens diferentes, a configuração de
produção também precisa contemplar CORS e cookies com credenciais. Prefira um
reverse proxy que mantenha `/api` no mesmo origin sempre que possível.

## Desenvolvimento full-stack

Este é um repositório independente. Os testes E2E integrados esperam, por
padrão, que o clone da API esteja em `../game-tracker-api`. Outra localização
pode ser informada por `GAMETRACK_API_DIR`.

Mudanças que alterem o contrato HTTP devem ter branches correspondentes e PRs
com links cruzados nos dois repositórios. O Swagger/OpenAPI da API é a fonte de
verdade do contrato.
