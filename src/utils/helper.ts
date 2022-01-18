export async function promiseObject<T = unknown, R = any>(
  obj: Record<string, T>,
  map: (v: T) => Promise<R>
): Promise<Record<string, R>> {
  const keys = Object.keys(obj);
  const ret = await Promise.all(keys.map((it) => map(obj[it])));

  return ret.reduce<Record<string, R>>((prev, cur, index) => {
    prev[keys[index]] = cur;
    return prev;
  }, {});
}

export function mapValues<T = unknown, R = any>(
  obj: Record<string, T>,
  map: (v: T) => R
) {
  const keys = Object.keys(obj);

  return keys.reduce<Record<string, R>>((prev, cur, index) => {
    prev[keys[index]] = map(obj[cur]);
    return prev;
  }, {});
}
