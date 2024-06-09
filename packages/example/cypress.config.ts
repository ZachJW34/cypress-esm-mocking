import { defineConfig } from "cypress";
import viteConfig from "./vite.config";
import { viteConfigWorkerAllowed } from "cypress-vite-esm-msw-mocker/node";

export default defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
      viteConfig: viteConfigWorkerAllowed(viteConfig),
    },
  },
});
