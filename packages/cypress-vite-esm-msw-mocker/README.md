# `cypress-vite-esm-msw-mocker`

This package enables the interception and mocking of ESM modules in Cypress Vite-based component tests using MSW.

### Prequisites

1. Make sure you have MSW setup in your project. Your project should have a service worker script in your apps public directory setup via: `npx msw init public`

2. Install this package: `npm install cypress-vite-esm-msw-mocker -D`

3. Setup Cypress Component Testing for a Vite-based project

### Setup

Register MSW in your Cypress component testing support file and handle MSW cleanup:

```javascript
// .../cypress/support/component.ts

import { registerMswMocker } from "cypress-vite-esm-msw-mocker";

before(() => {
  cy.wrap(registerMswMocker());
});

after(() => {
  window.mswWorker.resetHandlers();
});
```

### API

    Caveats:

    - MSW works by intercepting network requests and replacing the response with a module you create. To ensure MSW is able to intercept the request successfully, the mock needs to be registered before the network request for you component (or a dependency of your component that you are trying to mock) is made. This can be done by registering mocks in your support file, or by lazily importing your component in your test via `import('...')`.

    - Mocks can only be changed per spec file rather than per test. This might be a limitation in my understanding of MSW but modules, once fetched, were cached by the browser and unable to be modified until after a window reload (spec file change).

- `mockModule`

  ```typescript
  function mockModule(matcher: string, mockPath: string): void;

  // @example Mock ".../lib/index.ts" with "./mocks.ts".
  mockModule("/index.ts", import.meta.resolve("./mocks.ts"));
  ```

- `mockModuleAsString`

  ```typescript
  function mockModuleAsString(matcher: string, moduleContent: string): void;

  // @example Mock ".../lib/index.ts" with "export const message = 'mocked message'".
  mockModuleAsString("/index.ts", `export const message = 'mocked message'`);
  ```

### Example

```typescript
import { mockModule } from "cypress-vite-esm-msw-mocker";

const mountAsync = () =>
  cy.then(() => import("./HelloWorld.vue").then((m) => cy.mount(m.default)));

describe("<HelloWorld />", () => {
  it("renders w/ mock", () => {
    mockModule("**/lib/index.ts", import.meta.resolve("./HelloWorld.mocks.ts"));

    // Have to lazily import component so as to ensure the module request occurs after the module is mocked.
    mountAsync();
    cy.contains("world hello");
  });
});
```
