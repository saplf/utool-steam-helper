export type PluginEnterCallback = Parameters<UToolsApi['onPluginEnter']>[0];
export type DbPullCallback = Parameters<UToolsApi['onDbPull']>[0];
export type CommonCallback = () => void;

type ListenerType = 'pluginEnter' | 'pluginOut' | 'pluginDetach' | 'dbPull';

const listeners: Partial<Record<ListenerType, Function[]>> = {};

export function initToolCallback() {
  utools.onPluginEnter((action) => {
    const box = listeners['pluginEnter'] ?? [];
    box.forEach((cb) => cb(action));
  });

  utools.onPluginOut(() => {
    const box = listeners['pluginOut'] ?? [];
    box.forEach((cb) => cb());
  });

  utools.onPluginDetach(() => {
    const box = listeners['pluginDetach'] ?? [];
    box.forEach((cb) => cb());
  });

  utools.onDbPull((docs) => {
    const box = listeners['dbPull'] ?? [];
    box.forEach((cb) => cb(docs));
  });
}

export function addToolListener(
  type: 'pluginEnter',
  cb: PluginEnterCallback
): void;
export function addToolListener(type: 'dbPull', cb: DbPullCallback): void;
export function addToolListener(
  type: Exclude<ListenerType, 'pluginEnter' | 'dbPull'>,
  cb: CommonCallback
): void;
export function addToolListener(type: ListenerType, cb: Function) {
  const box = listeners[type] ?? [];
  if (!listeners[type]) {
    listeners[type] = box;
  }
  const index = box.findIndex((it) => it === cb);
  if (index !== -1) return;
  box.push(cb);
}

export function removeToolListener(
  type: 'pluginEnter',
  cb: PluginEnterCallback
): void;
export function removeToolListener(type: 'dbPull', cb: DbPullCallback): void;
export function removeToolListener(
  type: Exclude<ListenerType, 'pluginEnter' | 'dbPull'>,
  cb: CommonCallback
): void;
export function removeToolListener(type: ListenerType, cb: Function) {
  const box = listeners[type] ?? [];
  const index = box.findIndex((it) => it === cb);
  if (index === -1) return;
  box.splice(index, 1);
}
