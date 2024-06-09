import { mockModule } from "cypress-vite-esm-msw-mocker";

const mountAsync = () =>
  cy.then(() => import("./App.vue").then((m) => cy.mount(m.default)));

describe("<App />", () => {
  it("renders", () => {
    mockModule("**/HelloWorld.vue", import.meta.resolve("./App.mocks.vue"));
    mountAsync();
    cy.contains("This component was mocked");
  });
});
