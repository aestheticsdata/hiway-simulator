# Hiway Simulator

Net income simulator for a self-employed doctor, built with Next.js 16, React 19, TypeScript, Zod, React Hook Form, TanStack Query, Axios, Recharts, Tailwind CSS v4, and shadcn/ui.

This repository currently includes:

- a responsive single-page dashboard UI;
- typed App Router API routes;
- a shared domain contract between frontend and backend;
- a server-only simulation engine;
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
pnpm test:e2e
pnpm test:e2e:headed
pnpm test:unit
pnpm test:unit:coverage
```

## Environment variables

- `NEXT_PUBLIC_API_BASE_URL`: base URL used by the frontend HTTP client.
- `NEXT_PUBLIC_SITE_URL`: optional public site URL used to resolve Next.js metadata such as canonical and Open Graph URLs.

If `NEXT_PUBLIC_SITE_URL` is not set, metadata falls back to Vercel-provided deployment domains when available, then to `https://hiwaysim.1991computer.com`.

## Unit tests

Current scope:

- `lib/simulator/server/__tests__/calculateSimulationResult.test.ts`
  - covers `micro` vs `reel` calculation paths;
  - verifies cotisation totals, quotient familial, tax brackets, and net income outputs;
  - locks the current rounding behavior;
  - includes characterization checks against `referenceRates`.
- `lib/simulator/server/__tests__/calculateIncomeCurve.test.ts`
  - covers range presets, sampling bounds, and fallback ranges;
  - verifies sorted and deduplicated sampling;
  - checks that the current scenario is always injected into the curve;
  - verifies that each point recalculates `revenuNetAnnuel` from the simulation engine.

Run the unit test suite:

```bash
pnpm test:unit
```

Run the same suite with coverage:

```bash
pnpm test:unit:coverage
```

Current exclusions:

- `POST /api/simulate` route handler is not unit-tested yet;
- `POST /api/simulate-curve` route handler is not unit-tested yet.

## End-to-end tests

The project also includes a Playwright e2e suite under `tests-e2e`.

Current scope:

- `tests-e2e/simulator.form.spec.ts`
  - validates required and minimum-value errors;
  - covers `reel` and `micro-BNC` form behavior;
  - verifies that the `charges` validation state survives regime switches.
- `tests-e2e/simulator.modes.spec.ts`
  - covers the default `reel` simulation flow;
  - verifies the `micro-BNC` toggle and `charges` field hiding;
  - restores simulator state from URL search params on page load.
- `tests-e2e/simulator.comparison.spec.ts`
  - covers the `Mode comparaison` / `view=vs` flow;
  - verifies the optimal-regime summary and displayed gains;
  - checks that comparison mode waits for real-world `charges` when needed.

Run the full e2e suite:

```bash
pnpm test:e2e
```

Run the same suite in headed mode with Chromium:

```bash
pnpm test:e2e:headed
```

Playwright starts the local Next.js server automatically on
`http://127.0.0.1:3000` through `playwright.config.ts`.

If Playwright browsers are not installed yet on the machine, install Chromium
once before the first run:

```bash
pnpm exec playwright install chromium
```

The suite currently runs on the `chromium` project only and uses the HTML
reporter.

## Runtime ports

- Local development uses `pnpm dev` on `http://localhost:3000`.
- Production on `ks-b` runs through PM2 on `127.0.0.1:3001`.
- Nginx terminates HTTPS for `https://hiwaysim.1991computer.com` and proxies requests to `3001`.

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
-> Next.js route handlers (/api/rates, /api/simulate, /api/simulate-curve)
-> server-only simulation engine
-> SimulationResult / IncomeCurveResponse
-> UI cards + chart adapters
```

## Frontend architecture

### UI shell

The page shell is rendered through the App Router:

- `app/layout.tsx`: global layout and providers wiring.
- `app/page.tsx`: page composition.
- `components/providers/AppProviders.tsx`: `NuqsAdapter`, `ThemeProvider`, and `QueryClientProvider`.

### Simulator UI

The simulator UI is split into focused components:

- `components/simulator/SimulatorDashboard.tsx`
  - owns the form state;
  - debounces the input;
  - triggers API queries;
  - switches the right pane between the default result view and the simplified `VS` comparison view;
  - keeps the desktop scroll behavior where only the right pane scrolls.
- `components/simulator/SimulatorForm.tsx`
  - renders the form fields;
  - uses `react-hook-form` + `zodResolver`;
  - renders the `Mode VS` switch below the form;
  - disables the `regime` select while the `VS` comparison is active;
  - can force the `charges` field visible when `VS` is requested from a `micro` scenario without stored real-world charges.
- `components/simulator/simulator-results/*`
  - orchestrates summary cards, breakdown, charts, and the simplified `VS` comparison cards.
- `components/simulator/charts/*`
  - renders Recharts components only;
  - does not own business logic.

### UI text catalogs

Visible simulator copy is centralized in dedicated `texts.ts` modules instead
of being scattered across JSX.

This project currently uses four text entry points:

- `components/simulator/texts.ts`
  - copy for the left panel form;
  - field labels, placeholders, helper text, and empty-state messaging.
- `components/simulator/simulator-results/texts.ts`
  - copy for the right-panel cards;
  - section titles, descriptions, alert text, and skeleton labels.
- `components/simulator/charts/texts.ts`
  - copy for chart cards and chart-specific UI;
  - legends, tooltip labels, badges, and curve range wording.
- `lib/simulator/texts.ts`
  - shared presentation and validation copy;
  - regime labels, range preset labels, summary labels, and Zod error messages.

The split is intentional:

- component-local text stays close to the UI concern that renders it;
- shared business-facing labels live under `lib/simulator` so they can be
  reused by presentation helpers and schemas;
- components stay focused on rendering and interpolation, not copy ownership.

#### Key naming convention

Text object keys should be written in English, even when the displayed text is
French.

Examples:

- `annualNetIncome`
- `taxRegime`
- `incomeSensitivity`
- `microExpensesFallback`

Keep French only when the business term itself is inherently French and would
become less clear if translated, such as `micro-BNC` or `quotient familial` in
the displayed value.

#### Where to add new copy

When adding or changing simulator copy:

1. If the text is only used by one UI area, add it to that area's
   `components/.../texts.ts`.
2. If the same wording is reused across presentation helpers, schemas, or
   multiple UI surfaces, add it to `lib/simulator/texts.ts`.
3. Import the text object into the component or helper instead of hardcoding
   strings in JSX or schema definitions.

Current examples:

- `SimulatorForm.tsx` reads left-panel copy from `components/simulator/texts.ts`.
- right-panel cards read copy from
  `components/simulator/simulator-results/texts.ts`.
- chart cards and chart adapters read copy from
  `components/simulator/charts/texts.ts`.
- `lib/simulator/presentation.ts` and
  `lib/simulator/schemas/simulatorFormSchema.ts` reuse
  `lib/simulator/texts.ts`.

### URL-synced state with `nuqs`

The simulator supports bookmarkable searches through `nuqs`.

The implementation is intentionally based on:

- **form as the source of truth**;
- URL state mirrored from the form;
- API requests derived from normalized form values.

This app does **not** use the URL as the primary state container.

That choice is deliberate because:

- the form is already owned by `react-hook-form`;
- Zod validation already lives at the form layer;
- the UI has conditional behavior such as guarding `VS` activation until real
  `charges` are available for the comparison;
- React Query queries already depend on the form state.

The `nuqs` integration lives in:

- `components/providers/AppProviders.tsx`
- `components/simulator/SimulatorDashboard.tsx`
- `lib/simulator/searchParams.ts`

#### Search params used by the simulator

The current URL contract mirrors the simulation input and the active result
view:

- `regime`
- `honoraires`
- `charges`
- `partsFiscales`
- `view`

Current behavior:

- `view=vs` activates the simplified right-panel comparison view;
- when `view=vs`, `regime` is intentionally omitted from the URL because the
  comparison computes both `micro-BNC` and `reel`;
- when the UI is in the default result view, `regime` is still mirrored in the
  URL as before.

#### Synchronization flow

The synchronization flow is:

1. `NuqsAdapter` enables App Router query state handling.
2. `SimulatorDashboard` reads simulation input search params with
   `useQueryStates(...)` and the active result view with `useQueryState(...)`.
3. Search params are normalized into a valid `SimulationInput`.
4. The form is hydrated or reset from that normalized input.
5. The user edits the form through `react-hook-form`.
6. The current form values are normalized again.
7. The normalized form values are debounced.
8. The debounced values are mirrored back to the URL with `history: "replace"`.
9. The display mode is mirrored independently through `view`.
10. The debounced values drive either the default simulation query or the
    comparison query, depending on `view`.

#### Why normalization exists

`nuqs` parsers are intentionally lightweight. They parse querystring values, but
they are not the final business validator for the simulator.

This app therefore introduces `lib/simulator/searchParams.ts` as a dedicated
normalization layer.

Its responsibilities are:

- parse URL values through `nuqs`;
- merge missing or invalid values with `defaultFormValues`;
- enforce canonical business rules before the values hit the API;
- keep URL state and form state comparable.

Current examples:

- if a query param is missing, a default value is used;
- if a numeric query param is invalid, the app falls back to a valid value;
- if `view=vs`, the form keeps its current `regime`, but the URL does not
  expose it;
- if `regime === "micro"` in the default view, `charges` is canonicalized to
  `0` only for the simulation request, not for the persisted form state.

#### Why the URL uses `replace` history

The URL is updated with `history: "replace"` instead of `push`.

This keeps the Back button usable and avoids generating a browser history entry
for every keystroke.

#### Why the API is not driven directly by raw query params

The API request is intentionally driven by the normalized debounced form state,
not by raw search params.

This ensures that:

- the API always receives a valid `SimulationInput`;
- React Query keys stay aligned with validated business input;
- charts and dashboard cards are derived from the same canonical result;
- the `VS` comparison can preserve a user-entered `charges` value even when the
  current form regime is `micro`;
- URL state remains a persistence mechanism, not the business source of truth.

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
- `app/api/simulate-comparison/route.ts`
- `app/api/simulate-curve/route.ts`

At this stage, the app is still a single Next.js project, but the internal boundaries already mimic a cleaner front/backend split.

### Route responsibilities

`GET /api/rates`

- returns the static rates defined by the brief;
- validates the output against `ratesResponseSchema`.

`POST /api/simulate`

- parses the request body with `simulatorFormSchema.safeParse(...)`;
- returns `400` when the payload is invalid;
- calls the server-only simulation engine;
- validates the returned value against `simulationResultSchema`.

`POST /api/simulate-comparison`

- parses the request body with `simulatorFormSchema.safeParse(...)`;
- returns `400` when the payload is invalid;
- computes both `micro-BNC` and `reel` scenarios from the same input;
- ignores `charges` for the `micro-BNC` branch only;
- derives the optimal regime plus annual and monthly gain;
- validates the returned value against `simulationComparisonResultSchema`.

`POST /api/simulate-curve`

- parses the request body with `incomeCurveRequestSchema.safeParse(...)`;
- returns `400` when the payload is invalid;
- builds a revenue curve server-side from the current simulation input and selected range preset;
- recalculates the full simulation for each sampled `honoraires` value instead of projecting from a constant global deduction rate;
- validates the returned value against `incomeCurveResponseSchema`.

## Shared domain contracts

The shared frontend/backend contract layer lives under `lib/simulator`.

### Constants

- `lib/simulator/constants/defaultFormValues.ts`
- `lib/simulator/constants/fiscalRegimes.ts`
- `lib/simulator/constants/simulatorViewModes.ts`

### Interfaces

- `lib/simulator/interfaces/IncomeCurveRequest.ts`
- `lib/simulator/interfaces/IncomeCurveResponse.ts`
- `lib/simulator/interfaces/SimulationComparisonResult.ts`
- `lib/simulator/interfaces/SimulationInput.ts`
- `lib/simulator/interfaces/SimulationFormValues.ts`
- `lib/simulator/interfaces/SimulationResult.ts`
- `lib/simulator/interfaces/SimulatorViewMode.ts`
- `lib/simulator/interfaces/RatesResponse.ts`
- `lib/simulator/interfaces/CotisationRate.ts`
- `lib/simulator/interfaces/CotisationBreakdownItem.ts`
- `lib/simulator/interfaces/TaxBracket.ts`

### Schemas

- `lib/simulator/schemas/incomeCurvePointSchema.ts`
- `lib/simulator/schemas/incomeCurveRequestSchema.ts`
- `lib/simulator/schemas/incomeCurveResponseSchema.ts`
- `lib/simulator/schemas/simulatorFormSchema.ts`
- `lib/simulator/schemas/simulationComparisonResultSchema.ts`
- `lib/simulator/schemas/simulationResultSchema.ts`
- `lib/simulator/schemas/ratesResponseSchema.ts`
- `lib/simulator/schemas/cotisationRateSchema.ts`
- `lib/simulator/schemas/cotisationBreakdownItemSchema.ts`
- `lib/simulator/schemas/taxBracketSchema.ts`

### Presentation helpers

- `lib/simulator/formatters.ts`
- `lib/simulator/presentation.ts`
- `lib/simulator/texts.ts`

## Server-only simulation modules

The backend-only simulation layer lives under `lib/simulator/server`.

- `lib/simulator/server/referenceRates.ts`
- `lib/simulator/server/calculateSimulationResult.ts`
- `lib/simulator/server/calculateSimulationComparisonResult.ts`
- `lib/simulator/server/calculateIncomeCurve.ts`

These modules are marked `server-only` so client components cannot import the
simulation source of truth by mistake.

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

You can verify that the route handler validation works independently from the frontend form by sending invalid payloads manually.

Example 1: invalid type for `honoraires`

This checks that the route rejects a malformed request body even if the frontend would normally prevent it.

```bash
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"regime":"micro","honoraires":"abc","charges":0,"partsFiscales":1}'
```

Expected result:

- HTTP status `400`
- validation error payload from the route handler

Example 2: missing required field

This checks that the route does not accept incomplete payloads.

```bash
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"regime":"micro","honoraires":120000,"charges":0}'
```

Expected result:

- HTTP status `400`
- validation error payload from the route handler

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
- `simulateComparison(input)`
- `simulateCurve(input)`

### Service facade

- `lib/api/simulator/simulator.service.ts`

This is the frontend-facing service layer. Components should not call Axios directly.

Its role is to expose a stable frontend API such as:

- `loadRates()`
- `runSimulation(input)`
- `runSimulationComparison(input)`
- `runSimulationCurve(input)`

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
- coordinating the debounced simulation request lifecycle.

Current hooks:

- `useRatesQuery()`
- `useSimulationResultQuery(input, enabled)`
- `useSimulationComparisonQuery(input, enabled)`
- `useSimulationCurveQuery(input, enabled)`

Even though `/api/simulate` is a `POST`, it is treated as a query from the UI perspective because it reads a computed result and does not mutate persisted server state.

TanStack Query also fits well with the `nuqs` strategy used in this project:

- `nuqs` restores bookmarkable input state;
- `react-hook-form` owns interactive editing;
- React Query executes the resulting debounced simulation request.

## Error handling

The app uses `app/error.tsx` as the route-level error boundary.

Important detail: in Next.js App Router, errors are not redirected to `error.tsx`. They are thrown and then caught by the segment error boundary.

Current flow:

1. the HTTP client detects an invalid response or transport failure;
2. it throws `ApiException`;
3. TanStack Query propagates the error during render;
4. Next.js renders `app/error.tsx`.

`app/error.tsx` also resets the TanStack Query error boundary before retrying.

### Development-only API error debugging

The app includes a small development-only mechanism to simulate API failures on demand.

It is designed to test:

- transport failures;
- `500` responses from route handlers;
- invalid API payloads caught by frontend `safeParse(...)`.

The mechanism is intentionally kept outside the business URL state:

- the bookmarkable `nuqs` search params stay clean;
- debug behavior is opt-in and local to the current browser;
- production behavior is unaffected.

Implementation points:

- localStorage key: `debug-api-error`
- request header injected by the HTTP client: `x-debug-api-error`
- constants file: `lib/api/core/constants/debugApi.ts`

Supported debug modes:

- `rates-500`
- `simulate-500`
- `simulate-invalid-schema`

How to enable a mode in the browser console:

```js
localStorage.setItem("debug-api-error", "simulate-500");
```

```js
localStorage.setItem("debug-api-error", "simulate-invalid-schema");
```

```js
localStorage.setItem("debug-api-error", "rates-500");
```

How to disable it:

```js
localStorage.removeItem("debug-api-error");
```

What each mode does:

- `rates-500`: forces `GET /api/rates` to return a `500` response
- `simulate-500`: forces `POST /api/simulate` to return a `500` response
- `simulate-invalid-schema`: returns an intentionally invalid successful payload so the frontend `safeParse(...)` path is exercised

This mechanism is enabled only in development.

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

- `lib/simulator/server/referenceRates.ts`

The actual simulation logic is not duplicated in the UI. The right pane is
driven by the API result, and the initial loading state is represented with
skeleton components instead of fake financial data.

The simplified `VS` view follows the same rule. The UI does not compute the
comparison locally from displayed card values; it consumes a dedicated contract
that contains:

- a `micro` `SimulationResult`;
- a `reel` `SimulationResult`;
- `optimalRegime`;
- `annualGain`;
- `monthlyGain`.

The `VS` toggle is also guarded when the current form regime is `micro` and no
real-world `charges` have been provided yet. In that case, the form reveals the
`charges` field, keeps the URL in the default result view, and only activates
`view=vs` once the missing value is entered.

The income curve follows the same rule: each plotted point is produced by a
full server-side recalculation through `calculateSimulationResult(...)` for a
specific `honoraires` value. The chart line is visually interpolated by the
charting library between sampled points, but the sampled values themselves are
exact outputs of the business formulas.

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
- server-only calculation engine;
- unit tests for `calculateSimulationResult`;
- unit tests for `calculateIncomeCurve`;
- unit tests for `calculateSimulationComparisonResult`;
- server-side income curve generation;
- service facade over Axios;
- React Query integration;
- chart adapters from domain data;
- simplified `Mode VS` comparison view with URL-synced `view=vs`;
- dedicated `POST /api/simulate-comparison` comparison endpoint;
- Next.js error boundary integration.

Still natural next steps:

- expand business rules if the brief evolves;
- add API integration tests for route handlers;
- add richer comparison surfaces if the brief eventually needs more than the
  simplified three-card `VS` summary.
