
type OkResult<T> = { ok: true, value: T; };
type ErrResult = { ok: false, error: Error; };
type Result<T> = OkResult<T> | ErrResult;


function Ok<T extends {}>(value: T): Result<T> {
	return { ok: true, value };
}

function Err<T extends {}>(message: string): Result<T>;
function Err<T extends {}>(message: Error): Result<T>;
function Err(err: string | Error): ErrResult {
	if (typeof err === "string") {
		err = new Error(err);
	}
	return { ok: false, error: err };
}

function syncCall<T extends {}>(fn: () => T): Result<T> {
	try {
		const value = fn();
		return Ok(value);
	} catch (error) {
		return Err(error as Error);
	}
}

async function asyncCall<T extends {}>(fn: () => Promise<T>): Promise<Result<T>> {
	try {
		const value = await fn();
		return Ok(value);
	} catch (error) {
		return Err(error as Error);
	}
}

const Res = Object.freeze({
	Ok,
	Err,
	syncCall,
	asyncCall,
});
