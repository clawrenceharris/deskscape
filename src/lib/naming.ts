type Primitive = string | number | boolean | null | undefined;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== "object") return false;
  return Object.prototype.toString.call(value) === "[object Object]";
};

export const toCamelCase = (value: string): string =>
  value.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());

export const toSnakeCase = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/__/g, "_")
    .toLowerCase();

const mapKeysDeep = (value: unknown, mapKey: (key: string) => string): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => mapKeysDeep(item, mapKey));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.keys(value).reduce<Record<string, unknown>>((acc, key) => {
    acc[mapKey(key)] = mapKeysDeep(value[key], mapKey);
    return acc;
  }, {});
};

export type SnakeToCamelCase<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<SnakeToCamelCase<Tail>>}`
    : S;

export type CamelToSnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Tail extends Uncapitalize<Tail>
    ? `${Lowercase<Head>}${CamelToSnakeCase<Tail>}`
    : `${Lowercase<Head>}_${CamelToSnakeCase<Tail>}`
  : S;

export type CamelizeKeys<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<CamelizeKeys<U>>
    : T extends object
      ? { [K in keyof T as SnakeToCamelCase<Extract<K, string>>]: CamelizeKeys<T[K]> }
      : T;

export type SnakeizeKeys<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<SnakeizeKeys<U>>
    : T extends object
      ? { [K in keyof T as CamelToSnakeCase<Extract<K, string>>]: SnakeizeKeys<T[K]> }
      : T;

export type DomainModel<TDb> = CamelizeKeys<TDb>;
export type DomainInsert<TDbInsert> = CamelizeKeys<TDbInsert>;
export type DomainUpdate<TDbUpdate> = CamelizeKeys<TDbUpdate>;

export const camelizeKeys = <T>(value: T): CamelizeKeys<T> =>
  mapKeysDeep(value, toCamelCase) as CamelizeKeys<T>;

export const snakeizeKeys = <T>(value: T): SnakeizeKeys<T> =>
  mapKeysDeep(value, toSnakeCase) as SnakeizeKeys<T>;