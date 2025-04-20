
interface IResult<Ok extends boolean, Value> {
  ok: Ok;
  mapVal<R>(fn: (value: Value) => R): Result<R>;
  mapErr<R extends Error>(fn: (error: Error) => R): Result<Value>;
};
interface OkResult<T> extends IResult<true, T> {
  value: T;
};
interface ErrResult extends IResult<false, never> {
  error: Error;
};
export type Result<T> = OkResult<T> | ErrResult;

function Ok<T>(value: T): Result<T> {
  const ok: OkResult<T> = {
    ok: true,
    value,
  } as any;
  ok.mapVal = mapVal.bind(null, ok as any) as any;
  ok.mapErr = mapErr.bind(null, ok as any) as any;
  return ok;
}

function Err(error: string | Error): ErrResult {
  if (typeof error === "string") {
    error = new Error(error);
  }
  const e: ErrResult = {
    ok: false,
    error,
  } as any;
  e.mapVal = mapVal.bind(null, e as any) as any;
  e.mapErr = mapErr.bind(null, e as any) as any;
  return e;
}

function syncCall<T>(fn: () => T): Result<T> {
  try {
    const value = fn();
    return Ok(value);
  } catch (error) {
    return Err(error as Error);
  }
}

async function asyncCall<T>(fn: (() => Promise<T>) | Promise<T>): Promise<Result<T>> {
  try {
    const value = await (typeof fn === "function" ? fn() : fn);
    return Ok(value);
  } catch (error) {
    return Err(error as Error);
  }
}

function mapVal<T, R>(fromRes: Result<T>, fn: (value: T) => R): Result<R> {
  if (!fromRes.ok) {
    return fromRes;
  }
  try {
    const value = fn(fromRes.value);
    return Ok(value);
  } catch (e) {
    return Err(e as Error);
  }
}

function mapErr<T, E extends Error>(fromRes: Result<T>, fn: (error: Error) => E): Result<T> {
  if (fromRes.ok) {
    return fromRes;
  }
  const err = fn(fromRes.error);
  return Err(err);
}

export const Res = Object.freeze({
  Ok,
  Err,
  syncCall,
  asyncCall,
});
