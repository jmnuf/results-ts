type OkResult<T> = { ok: true, value: T; };
type ErrResult = { ok: false, error: Error; };
export type Result<T> = OkResult<T> | ErrResult;


function Ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

function Err(err: string | Error): ErrResult {
  if (typeof err === "string") {
    err = new Error(err);
  }
  return { ok: false, error: err };
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

export const Res = Object.freeze({
  Ok,
  Err,
  syncCall,
  asyncCall,
});
