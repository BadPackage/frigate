import * as monaco from "monaco-editor";

/**
 * Options for the `createWebWorker` API that monaco-editor removed in 0.55.
 * monaco-yaml (through monaco-worker-manager) still calls it this way.
 */
type LegacyWebWorkerOptions = {
  moduleId?: string;
  label?: string;
  createData?: unknown;
  host?: monaco.editor.IInternalWebWorkerOptions["host"];
  keepIdleModels?: boolean;
};

type MonacoEnvironmentWorkers = {
  getWorker?: (moduleId: string, label: string) => Worker | Promise<Worker>;
  getWorkerUrl?: (moduleId: string, label: string) => string;
};

function createWorkerForLabel(label: string): Worker | Promise<Worker> {
  const environment = (
    globalThis as { MonacoEnvironment?: MonacoEnvironmentWorkers }
  ).MonacoEnvironment;

  if (environment?.getWorker) {
    return environment.getWorker("workerMain.js", label);
  }

  if (environment?.getWorkerUrl) {
    return new Worker(environment.getWorkerUrl("workerMain.js", label), {
      name: label,
    });
  }

  throw new Error(`No MonacoEnvironment worker is defined for "${label}"`);
}

/**
 * Wrap the monaco API so `editor.createWebWorker` also accepts the legacy
 * `{ moduleId, label, createData }` options.
 *
 * Since monaco-editor 0.55, `createWebWorker` only takes an already created
 * worker, so libraries built for the old API (monaco-yaml) never start their
 * language worker and lose validation, completion and hover. This mirrors
 * monaco's own adapter for its bundled languages: create the worker for the
 * label from MonacoEnvironment, then send the init message followed by the
 * create data, which the worker reads before serving requests.
 */
export function withLegacyWebWorkers(api: typeof monaco): typeof monaco {
  function createWebWorker<T extends object>(
    opts: LegacyWebWorkerOptions | monaco.editor.IInternalWebWorkerOptions,
  ): monaco.editor.MonacoWebWorker<T> {
    if ("worker" in opts) {
      return api.editor.createWebWorker<T>(opts);
    }

    const worker = Promise.resolve(
      createWorkerForLabel(opts.label ?? "monaco-editor-worker"),
    ).then((created) => {
      created.postMessage("ignore");
      created.postMessage(opts.createData);
      return created;
    });

    return api.editor.createWebWorker<T>({
      worker,
      host: opts.host,
      keepIdleModels: opts.keepIdleModels,
    });
  }

  return {
    ...api,
    editor: { ...api.editor, createWebWorker },
  } as typeof monaco;
}
