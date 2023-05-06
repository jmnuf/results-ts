# Results
Some wrapper around values/function calls for distinguishing between values and errors in typescript with a discriminator type. If ok is true then we got a value, but if ok is false we got an error, simple enough.

Result from a synchronous function call
```ts
import { Res, type Result } from "@jmnuf/results";

const result: Result<number> = Res.syncCall(() => {
	// Some code that may error
	const num = Math.random();
	if (num > 0.5) {
		throw new Error("Number is too big");
	}
	return num;
});

if (result.ok) {
	console.log(result.value); // value exists as a number here
} else {
	console.error(result.error); // error exists as an Error instance
}
```

Result from an asynchronous function call
```ts
import { Res, type Result } from "@jmnuf/results";

async function myAsyncOperation() {
	/*
	 * do some async operation that may throw an error
	 */
}

async function myAsyncFn() {
	const result = Res.asyncCall(() => myAsyncOperation());
	if (result.ok) {
		console.log("Operation succesful");
	} else {
		console.log("Operation failed");
	}
}
```

Writing your own resulting function
```ts
import { Res, type Result } from "@jmnuf/results";

function myResultingFn() {
	const value = Math.floor(Math.random() * 100);
	if (value < 70) {
		return Res.Err("Percentage is too low");
	}
	return Res.Ok(value);
}

const result = myResultingFn();
if (result.ok) {
	console.log("Passing with a score of", result.value); // Result value is now a number
} else {
	console.log("Failing score");
}
```
