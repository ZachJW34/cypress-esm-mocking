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
