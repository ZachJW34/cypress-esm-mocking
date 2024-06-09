import { SetupWorker, setupWorker, StartOptions } from "msw/browser";
import { HttpResponse, http } from "msw";

declare global {
  interface Window {
    mswWorker: SetupWorker;
  }
}

export const defaultWorkerOptions: StartOptions = {
  serviceWorker: {
    url: "../src/public/mockServiceWorker.js",
    options: {
      scope: "/",
    },
  },
  quiet: true,
  onUnhandledRequest: "bypass",
};

export async function registerMswMocker(
  options?: StartOptions
): Promise<SetupWorker> {
  if (!window.mswWorker) {
    const worker = setupWorker();
    await worker.start(options || defaultWorkerOptions);
    window.mswWorker = worker;

    return worker;
  }

  return window.mswWorker;
}

/**
 * Replaces a matched module with the provided path to another file on disk.
 * The matcher supports the same glob matching as msw handlers.
 *
 * @param {string} matcher Match pattern.
 * @param {string} mockPath Path to resolve. Use `import.meta.resolve('<relative_path_to_module>')`
 *
 * @example
 * // Mock ".../lib/index.ts" with "./mocks.ts".
 * mockModule('/index.ts', import.meta.resolve('./mocks.ts'))
 */
export function mockModule(matcher: string, mockPath: string) {
  window.mswWorker.use(
    http.get(matcher, () => {
      return fetch(mockPath)
        .then((res) => res.text())
        .then((mock) =>
          HttpResponse.text(mock, {
            headers: { "Content-Type": "text/javascript" },
          })
        )
        .catch(() => {
          return HttpResponse.text("Failed to mock module", { status: 500 });
        });
    })
  );
}

/**
 * Replaces a matched module with the given text.
 * The matcher supports the same glob matching as msw handlers.
 *
 * @param {string} matcher Match pattern.
 * @param {string} moduleConent String content of the module to be mocked
 *
 * @example
 * // Mock ".../lib/index.ts" with "export const message = 'mocked message'".
 * mockModuleAsString('/index.ts', `export const message = 'mocked message'`)
 */
export function mockModuleAsString(matcher: string, moduleContent: string) {
  window.mswWorker.use(
    http.get(matcher, () => {
      return HttpResponse.text(moduleContent, {
        headers: { "Content-Type": "text/javascript" },
      });
    })
  );
}
