import { Hasher, Hasher32, WordArray } from "./core.mjs";

//#region src/sha1.ts
const W = [];
/**
* SHA-1 hash algorithm.
*/
var SHA1Algo = class extends Hasher32 {
	_doReset() {
		this._hash = new WordArray([
			1732584193,
			4023233417,
			2562383102,
			271733878,
			3285377520
		]);
	}
	_doProcessBlock(M, offset) {
		const H = this._hash.words;
		let a = H[0];
		let b = H[1];
		let c = H[2];
		let d = H[3];
		let e = H[4];
		for (let i = 0; i < 80; i += 1) {
			if (i < 16) W[i] = M[offset + i] | 0;
			else {
				const n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
				W[i] = n << 1 | n >>> 31;
			}
			let t = (a << 5 | a >>> 27) + e + W[i];
			if (i < 20) t += (b & c | ~b & d) + 1518500249;
			else if (i < 40) t += (b ^ c ^ d) + 1859775393;
			else if (i < 60) t += (b & c | b & d | c & d) - 1894007588;
			else t += (b ^ c ^ d) - 899497514;
			e = d;
			d = c;
			c = b << 30 | b >>> 2;
			b = a;
			a = t;
		}
		H[0] = H[0] + a | 0;
		H[1] = H[1] + b | 0;
		H[2] = H[2] + c | 0;
		H[3] = H[3] + d | 0;
		H[4] = H[4] + e | 0;
	}
	_doFinalize() {
		const data = this._data;
		const dataWords = data.words;
		const nBitsTotal = this._nDataBytes * 8;
		const nBitsLeft = data.sigBytes * 8;
		dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
		dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
		dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
		data.sigBytes = dataWords.length * 4;
		this._process();
		return this._hash;
	}
	clone() {
		const clone = super.clone.call(this);
		clone._hash = this._hash.clone();
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
* const hash = SHA1('message');
* const hash = SHA1(wordArray);
* ```
*/
const SHA1 = Hasher._createHelper(SHA1Algo);
/**
* Shortcut function to the HMAC's object interface.
*
* @param message - The message to hash.
* @param key - The secret key.
* @returns The HMAC.
*
* @example
* ```js
* const hmac = HmacSHA1(message, key);
* ```
*/
const HmacSHA1 = Hasher._createHmacHelper(SHA1Algo);

//#endregion
export { HmacSHA1, SHA1, SHA1Algo };
//# sourceMappingURL=sha1.mjs.map