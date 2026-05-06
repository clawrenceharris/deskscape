# Contributing

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Each commit title should follow:

```
<type>[optional scope]: <short description>
```

Common types:

| Type | When to use |
|------|-------------|
| `feat` | New user-facing behavior |
| `fix` | Bug fixes |
| `docs` | Documentation only |
| `chore` | Tooling, dependencies, config (no production code change) |
| `refactor` | Internal restructuring without changing behavior |
| `test` | Adding or fixing tests |
| `perf` | Performance improvements |

Examples:

- `feat(desk): add desk dashboard column`
- `feat(notebook): add ability to create notebooks`
- `fix(auth): surface sign-out errors from Supabase`
- `docs: expand README setup instructions`

Use the imperative mood (“add”, not “added”). Keep the first line around 72 characters or less. Add a body if the change needs context, breaking-change notes, or linked issue IDs.

## Before you push

From the repo root:

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run build
```

Fix any **errors** (lint exits non-zero only on errors; warnings are allowed today). If `npm run build` fails on `.next` permissions locally, remove the directory with sufficient permissions and rebuild (for example `rm -rf .next` then `npm run build`).

Vitest injects placeholder `NEXT_PUBLIC_*` values in `src/test/setup.ts` so unit tests do not require a real `.env` file. For integration or manual testing, configure environment variables as described in the README.

## Architecture

See the **Implementation Pattern** section in [README.md](./README.md). Prefer changes inside the relevant `src/features/<feature>/` module and keep server mutations in actions/use cases rather than in presentation components.
