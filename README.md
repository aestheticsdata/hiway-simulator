# Hiway Simulator

Net income simulator for a self-employed doctor, built with Next.js 16, React 19, TypeScript, Zod, React Hook Form, TanStack Query, Axios, Recharts, Tailwind CSS v4, and shadcn/ui.

This repository currently includes:

- a responsive single-page dashboard UI;
- typed App Router API routes;
- a shared domain contract between frontend and backend;
- a pure simulation engine;
- a frontend HTTP facade over Axios;
- chart adapters derived from domain results;
- error propagation to Next.js `error.tsx`.

## Getting started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
pnpm lint
pnpm build
```

## Project goals

The project is structured to support a technical test where both frontend architecture and backend/API design matter.

The current architecture is designed around three principles:

1. Keep business contracts shared between UI and API.
2. Keep HTTP concerns isolated from React components.
3. Keep chart formatting on the frontend, not in the backend.

## High-level architecture

```text
React UI
-> React Hook Form
-> debounced simulation input
-> TanStack Query hooks
-> simulator service facade
-> typed Axios HTTP client
-> Next.js route handlers (/api/rates, /api/simulate)
-> pure simulation engine
-> SimulationResult
-> UI cards + chart adapters
```

## Frontend architecture

### UI shell

The page shell is rendered through the App Router:

- `app/layout.tsx`: global layout and providers wiring.
- `app/page.tsx`: page composition.
- `components/providers/AppProviders.tsx`: `ThemeProvider` and `QueryClientProvider`.

### Simulator UI

The simulator UI is split into focused components:

- `components/simulator/SimulatorDashboard.tsx`
  - owns the form state;
  - debounces the input;
  - triggers API queries;
  - keeps the desktop scroll behavior where only the right pane scrolls.
- `components/simulator/SimulatorForm.tsx`
  - renders the form fields;
  - uses `react-hook-form` + `zodResolver`;
  - hides and resets `charges` when the selected regime is `micro`.
- `components/simulator/simulator-results/*`
  - orchestrates summary cards, breakdown, and charts.
- `components/simulator/charts/*`
  - renders Recharts components only;
  - does not own business logic.

### Chart adapters

Charts do not consume raw HTTP-specific data.

They consume `SimulationResult` and transform it locally through:

- `components/simulator/charts/chart-data.tsx`

This is intentional:

- the backend returns domain data;
- the frontend adapts that domain data into Recharts-friendly series;
- the API stays independent from the current charting library.

## Backend architecture

The backend currently lives inside Next.js App Router route handlers:

- `app/api/rates/route.ts`
- `app/api/simulate/route.ts`

At this stage, the app is still a single Next.js project, but the internal boundaries already mimic a cleaner front/backend split.

### Route responsibilities

`GET /api/rates`

- returns the static rates defined by the brief;
- validates the output against `ratesResponseSchema`.

`POST /api/simulate`

- parses the request body with `simulatorFormSchema.safeParse(...)`;
- returns `400` when the payload is invalid;
- calls the pure domain engine;
- validates the returned value against `simulationResultSchema`.

## Shared domain contracts

The shared domain layer lives under `lib/simulator`.

### Constants

- `lib/simulator/constants/defaultFormValues.ts`
- `lib/simulator/constants/fiscalRegimes.ts`
- `lib/simulator/constants/referenceRates.ts`

### Interfaces

- `lib/simulator/interfaces/SimulationInput.ts`
- `lib/simulator/interfaces/SimulationFormValues.ts`
- `lib/simulator/interfaces/SimulationResult.ts`
- `lib/simulator/interfaces/RatesResponse.ts`
- `lib/simulator/interfaces/CotisationRate.ts`
- `lib/simulator/interfaces/CotisationBreakdownItem.ts`
- `lib/simulator/interfaces/TaxBracket.ts`

### Schemas

- `lib/simulator/schemas/simulatorFormSchema.ts`
- `lib/simulator/schemas/simulationResultSchema.ts`
- `lib/simulator/schemas/ratesResponseSchema.ts`
- `lib/simulator/schemas/cotisationRateSchema.ts`
- `lib/simulator/schemas/cotisationBreakdownItemSchema.ts`
- `lib/simulator/schemas/taxBracketSchema.ts`

### Engine

- `lib/simulator/engine/calculateSimulationResult.ts`

The engine is pure and reusable. It has no React, no Axios, and no Next.js dependency.

That makes it suitable for:

- route handlers;
- unit tests;
- future comparison features such as `Micro-BNC vs Real`;
- possible extraction into a separate backend package later.

## Validation strategy

Validation happens at multiple levels.

### Form validation

The frontend form validates user input with:

- `react-hook-form`
- `zodResolver`
- `simulatorFormSchema`

### Request validation

`POST /api/simulate` validates the incoming payload with:

- `simulatorFormSchema.safeParse(...)`

### Response validation

The backend validates its own output with:

- `simulationResultSchema.parse(...)`
- `ratesResponseSchema.parse(...)`

The frontend validates HTTP responses again inside the Axios facade with:

- `zodSchema.safeParse(...)`

This double validation is intentional:

- the backend protects its contract;
- the frontend protects itself against invalid or drifting responses.

## HTTP layer and service facade

The HTTP client lives under `lib/api/core`.

### Core HTTP files

- `lib/api/core/httpClient.ts`
- `lib/api/core/ApiException.ts`
- `lib/api/core/interfaces/ApiRequestOptions.ts`

### What the HTTP client does

- wraps Axios;
- standardizes default headers;
- applies response validation with Zod;
- normalizes transport and contract errors into `ApiException`.

### Simulator API module

- `lib/api/simulator/simulator.api.ts`

This file contains the raw endpoint calls:

- `getRates()`
- `simulate(input)`

### Service facade

- `lib/api/simulator/simulator.service.ts`

This is the frontend-facing service layer. Components should not call Axios directly.

Its role is to expose a stable frontend API such as:

- `loadRates()`
- `runSimulation(input)`

If later the frontend needs to combine multiple endpoints, compare regimes, or add orchestration logic, that belongs here instead of in React components.

## Why TanStack Query is used here

TanStack Query sits between React components and the service facade.

The hooks live in:

- `lib/api/simulator/simulator.queries.ts`

It is used here for:

- loading state management;
- request deduplication;
- cache handling;
- stale/refresh policies;
- propagating query errors to the Next.js error boundary;
- preserving previous simulation data while a new debounced request is in flight.

Current hooks:

- `useRatesQuery()`
- `useSimulationResultQuery(input, enabled)`

Even though `/api/simulate` is a `POST`, it is treated as a query from the UI perspective because it reads a computed result and does not mutate persisted server state.

## Error handling

The app uses `app/error.tsx` as the route-level error boundary.

Important detail: in Next.js App Router, errors are not redirected to `error.tsx`. They are thrown and then caught by the segment error boundary.

Current flow:

1. the HTTP client detects an invalid response or transport failure;
2. it throws `ApiException`;
3. TanStack Query propagates the error during render;
4. Next.js renders `app/error.tsx`.

`app/error.tsx` also resets the TanStack Query error boundary before retrying.

## Current simulation contract

`SimulationResult` is the main output contract used across the app.

It currently includes:

- `bnc`
- `cotisations`
- `totalCotisations`
- `revenuImposable`
- `quotient`
- `impotParPart`
- `impotTotal`
- `revenuNetAnnuel`
- `revenuNetMensuel`
- `tauxGlobalPrelevements`

This shape is intentionally rich enough to feed:

- summary cards;
- detailed breakdown tables;
- bar charts;
- pie charts;
- future comparison views.

## Calculation source of truth

Rates are currently sourced from:

- `lib/simulator/constants/referenceRates.ts`

The example fallback result used before the first successful request is sourced from:

- `lib/simulator/mock-data.ts`

The actual simulation logic is not duplicated in the UI. The right pane is driven by the API result, and the fallback result is only there to avoid an empty dashboard during the first request.

## Path aliases

The project uses TypeScript path aliases declared in `tsconfig.json`:

- `@app/*`
- `@components/*`
- `@lib/*`

Internal imports should use these aliases instead of long relative paths.

## Current implementation status

Already in place:

- shared schemas and types for frontend and backend;
- typed route handlers;
- pure calculation engine;
- service facade over Axios;
- React Query integration;
- chart adapters from domain data;
- Next.js error boundary integration.

Still natural next steps:

- expand business rules if the brief evolves;
- add unit tests for the simulation engine;
- add API integration tests for route handlers;
- add side-by-side `Micro-BNC vs Real` comparison on top of the existing `SimulationResult` contract.
