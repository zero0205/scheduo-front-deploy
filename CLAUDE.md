# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build for production (runs TypeScript compilation first)
- `pnpm lint` - Run Biome linter with auto-fix
- `pnpm format` - Run Biome formatter with auto-fix
- `pnpm check` - Run Biome check (lint + format) with auto-fix
- `pnpm preview` - Preview production build
- `pnpm commit` - Use commitizen for conventional commits

## Architecture Overview

This is a React + TypeScript application built with Vite, following Feature-Sliced Design (FSD) architecture:

### Layer Structure
- **`@app`** - Application-level configuration, routing, and providers
- **`@pages`** - Full page components (login, main, oauth-redirect)
- **`@widgets`** - Complex UI blocks (Calendar, LeftSidebar, RightSidebar)
- **`@features`** - Business logic features (create-calendar, edit-calendar, input-schedule, etc.)
- **`@entities`** - Business entities (auth, calendar, member, notification, schedule)
- **`@shared`** - Reusable utilities, UI components, API setup, stores

### Key Technologies
- **React 19** with TypeScript
- **Vite** for build tooling
- **TanStack Query** for server state management (configured in `@shared/tanstack-query`)
- **Zustand** for client state management (auth store in `@shared/stores`)
- **React Router 7** for routing
- **Axios** with automatic token refresh and error handling
- **shadcn/ui** for UI components (built on Radix UI primitives)
- **Tailwind CSS** for styling (with Biome sorted classes)
- **React Hook Form** with Zod validation

### Authentication Flow
- OAuth2 flow with Google/Kakao providers
- JWT tokens (access + refresh) managed via Zustand persist
- Automatic token refresh in Axios interceptors
- Protected routes using `ProtectedRoute` component
- Auth store persisted to localStorage with key `scheduo-auth`

### API Layer
- Centralized Axios instance in `@shared/api/axios.ts`
- Automatic Authorization header injection
- **Centralized error handling**: All API errors caught in response interceptors and displayed via toast notifications
- **Automatic token refresh**: 401 errors trigger refresh token flow, then retry original request
- **Network error handling**: Connection failures show user-friendly messages
- Base URL configured via `VITE_API_BASE_URL` environment variable
- **Error flow**: Components don't need individual error handling - interceptor manages all error states centrally

### State Management
- **Server state**: TanStack Query with 5min stale time, 10min garbage collection
- **Client state**: Zustand stores (auth currently implemented)
- **Form state**: React Hook Form with Zod validation

### Code Quality Tools
- **Biome** for linting and formatting (configured for 2-space indents, 120 char lines)
- **Husky** + **lint-staged** for pre-commit hooks
- **Commitizen** with custom Korean conventional commit messages

### Path Aliases
All imports use absolute paths via aliases defined in both `vite.config.ts` and `tsconfig.json`:
- `@/*` → `./src/*`
- `@app/*` → `./src/app/*`
- `@pages/*` → `./src/pages/*`
- `@widgets/*` → `./src/widgets/*`
- `@features/*` → `./src/features/*`
- `@entities/*` → `./src/entities/*`
- `@shared/*` → `./src/shared/*`

### Commit Convention
Uses Korean conventional commits via `.cz-config.cjs`:
- `:sparkles: [Feat]` - New features
- `:bug: [Fix]` - Bug fixes
- `:memo: [Docs]` - Documentation
- `:art: [Style]` - Code style changes
- `:lipstick: [Design]` - UI design changes
- `:recycle: [Refactor]` - Code refactoring
- `:white_check_mark: [Test]` - Tests
- `:wrench: [Chore]` - Maintenance tasks

## Environment Variables
- `VITE_API_BASE_URL` - Backend API base URL

## Testing
No test framework is currently configured. Check with the team before adding tests to determine the preferred testing approach.

## Development Guidelines

### YAGNI Principle (You Aren't Gonna Need It)
- **Don't implement features or abstractions until they are actually needed**
- Avoid premature optimization and over-engineering
- Write simple, direct code that solves the current problem
- Add complexity only when requirements explicitly demand it

### TanStack Query Implementation
- Only implement query hooks that are currently being used
- Don't create speculative query keys for future use cases
- Keep query key structures simple - add hierarchy only when multiple related queries exist
- Example: Use `["notifications", "list"]` instead of complex nested structures until pagination/filtering is actually needed