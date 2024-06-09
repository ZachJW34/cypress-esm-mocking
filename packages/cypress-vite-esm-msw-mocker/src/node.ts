import { UserConfig } from "vite";

export function viteConfigWorkerAllowed(viteConfig: UserConfig): UserConfig {
  return {
    ...viteConfig,
    server: {
      ...viteConfig.server,
      headers: {
        ...viteConfig.server?.headers,
        "Service-Worker-Allowed": "/",
      },
    },
  };
}
