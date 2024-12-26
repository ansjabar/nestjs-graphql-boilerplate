export type RetryCallback<T> =
  | ((attempt: number) => Promise<T>)
  | ((attempt: number) => T);

export type WhereCallback =
  | ((error: any) => boolean)
  | ((error: any) => Promise<boolean>);

export type Milliseconds = number;

export type Minutes = number;
