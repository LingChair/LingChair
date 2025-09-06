import { X64Word, X64WordArray } from "./x64-core.mjs";
import { SHA512Algo } from "./sha512.mjs";

//#region src/sha384.ts
/**
* SHA-384 hash algorithm.
*/
var SHA384Algo = class extends SHA512Algo {
	_doReset() {
		this._hash = new X64WordArray([
			new X64Word(3418070365, 3238371032),
			new X64Word(1654270250, 914150663),
			new X64Word(2438529370, 812702999),
			new X64Word(355462360, 4144912697),
			new X64Word(1731405415, 4290775857),
			new X64Word(2394180231, 1750603025),
			new X64Word(3675008525, 1694076839),
			new X64Word(1203062813, 3204075428)
		]);
	}
	_doFinalize() {
		const hash = super._doFinalize.call(this);
		hash.sigBytes -= 16;
		return hash;
	}
	clone() {
		const clone = super.clone.call(this);
		return clone;
	}
};
/**
* Shortcut function to the hasher's object interface.
*
* @param message - The message to hash.
* @returns The hash.
*
* @example
* ```js
* const hash = SHA384('message');
* const hash = SHA384(wordArray);
* ```
*/
const SHA384 = SHA512Algo._createHelper(SHA384Algo);
/**
* Shortcut function to the HMAC's object interface.
*
* @param message - The message to hash.
* @param key - The secret key.
* @returns The HMAC.
*
* @example
* ```js
* const hmac = HmacSHA384(message, key);
* ```
*/
const HmacSHA384 = SHA512Algo._createHmacHelper(SHA384Algo);

//#endregion
export { HmacSHA384, SHA384, SHA384Algo };
//# sourceMappingURL=sha384.mjs.map