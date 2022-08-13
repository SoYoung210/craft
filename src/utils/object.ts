type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const entries = Object.entries as <T>(o: T) => Entries<T>;
export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];
export const values = Object.values as <T>(o: T) => T[keyof T][];

export const filterByKey = <T>(o: T, predicate: (key: keyof T) => boolean) => {
  return Object.fromEntries(entries(o).filter(([k]) => predicate(k)));
};
export const filterByValue = <T>(
  o: T,
  predicate: (value: T[keyof T]) => boolean
) => {
  return Object.fromEntries(entries(o).filter(([, v]) => predicate(v)));
};
