import { Hasher, Hasher32, WordArray } from "./core.mjs";

//#region src/ripemd160.ts
const _zl = WordArray.create([
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	7,
	4,
	13,
	1,
	10,
	6,
	15,
	3,
	12,
	0,
	9,
	5,
	2,
	14,
	11,
	8,
	3,
	10,
	14,
	4,
	9,
	15,
	8,
	1,
	2,
	7,
	0,
	6,
	13,
	11,
	5,
	12,
	1,
	9,
	11,
	10,
	0,
	8,
	12,
	4,
	13,
	3,
	7,
	15,
	14,
	5,
	6,
	2,
	4,
	0,
	5,
	9,
	7,
	12,
	2,
	10,
	14,
	1,
	3,
	8,
	11,
	6,
	15,
	13
]);
const _zr = WordArray.create([
	5,
	14,
	7,
	0,
	9,
	2,
	11,
	4,
	13,
	6,
	15,
	8,
	1,
	10,
	3,
	12,
	6,
	11,
	3,
	7,
	0,
	13,
	5,
	10,
	14,
	15,
	8,
	12,
	4,
	9,
	1,
	2,
	15,
	5,
	1,
	3,
	7,
	14,
	6,
	9,
	11,
	8,
	12,
	2,
	10,
	0,
	4,
	13,
	8,
	6,
	4,
	1,
	3,
	11,
	15,
	0,
	5,
	12,
	2,
	13,
	9,
	7,
	10,
	14,
	12,
	15,
	10,
	4,
	1,
	5,
	8,
	7,
	6,
	2,
	13,
	14,
	0,
	3,
	9,
	11
]);
const _sl = WordArray.create([
	11,
	14,
	15,
	12,
	5,
	8,
	7,
	9,
	11,
	13,
	14,
	15,
	6,
	7,
	9,
	8,
	7,
	6,
	8,
	13,
	11,
	9,
	7,
	15,
	7,
	12,
	15,
	9,
	11,
	7,
	13,
	12,
	11,
	13,
	6,
	7,
	14,
	9,
	13,
	15,
	14,
	8,
	13,
	6,
	5,
	12,
	7,
	5,
	11,
	12,
	14,
	15,
	14,
	15,
	9,
	8,
	9,
	14,
	5,
	6,
	8,
	6,
	5,
	12,
	9,
	15,
	5,
	11,
	6,
	8,
	13,
	12,
	5,
	12,
	13,
	14,
	11,
	8,
	5,
	6
]);
const _sr = WordArray.create([
	8,
	9,
	9,
	11,
	13,
	15,
	15,
	5,
	7,
	7,
	8,
	11,
	14,
	14,
	12,
	6,
	9,
	13,
	15,
	7,
	12,
	8,
	9,
	11,
	7,
	7,
	12,
	7,
	6,
	15,
	13,
	11,
	9,
	7,
	15,
	11,
	8,
	6,
	6,
	14,
	12,
	13,
	5,
	14,
	13,
	13,
	7,
	5,
	15,
	5,
	8,
	11,
	14,
	14,
	6,
	14,
	6,
	9,
	12,
	9,
	12,
	5,
	15,
	8,
	8,
	5,
	12,
	9,
	12,
	5,
	14,
	6,
	8,
	13,
	6,
	5,
	15,
	13,
	11,
	11
]);
const _hl = WordArray.create([
	0,
	1518500249,
	1859775393,
	2400959708,
	2840853838
]);
const _hr = WordArray.create([
	1352829926,
	1548603684,
	1836072691,
	2053994217,
	0
]);
/**
* RIPEMD160 round function 1
*/
const f1 = (x, y, z) => x ^ y ^ z;
/**
* RIPEMD160 round function 2
*/
const f2 = (x, y, z) => x & y | ~x & z;
/**
* RIPEMD160 round function 3
*/
const f3 = (x, y, z) => (x | ~y) ^ z;
/**
* RIPEMD160 round function 4
*/
const f4 = (x, y, z) => x & z | y & ~z;
/**
* RIPEMD160 round function 5
*/
const f5 = (x, y, z) => x ^ (y | ~z);
/**
* Rotate left helper
*/
const rotl = (x, n) => x << n | x >>> 32 - n;
/**
* RIPEMD160 hash algorithm.
*/
var RIPEMD160Algo = class extends Hasher32 {
	_doReset() {
		this._hash = WordArray.create([
			1732584193,
			4023233417,
			2562383102,
			271733878,
			3285377520
		]);
	}
	_doProcessBlock(M, offset) {
		const _M = M;
		for (let i = 0; i < 16; i += 1) {
			const offset_i = offset + i;
			const M_offset_i = _M[offset_i];
			_M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
		}
		const H = this._hash.words;
		const hl = _hl.words;
		const hr = _hr.words;
		const zl = _zl.words;
		const zr = _zr.words;
		const sl = _sl.words;
		const sr = _sr.words;
		let al = H[0];
		let bl = H[1];
		let cl = H[2];
		let dl = H[3];
		let el = H[4];
		let ar = H[0];
		let br = H[1];
		let cr = H[2];
		let dr = H[3];
		let er = H[4];
		let t;
		for (let i = 0; i < 80; i += 1) {
			t = al + _M[offset + zl[i]] | 0;
			if (i < 16) t += f1(bl, cl, dl) + hl[0];
			else if (i < 32) t += f2(bl, cl, dl) + hl[1];
			else if (i < 48) t += f3(bl, cl, dl) + hl[2];
			else if (i < 64) t += f4(bl, cl, dl) + hl[3];
			else t += f5(bl, cl, dl) + hl[4];
			t |= 0;
			t = rotl(t, sl[i]);
			t = t + el | 0;
			al = el;
			el = dl;
			dl = rotl(cl, 10);
			cl = bl;
			bl = t;
			t = ar + _M[offset + zr[i]] | 0;
			if (i < 16) t += f5(br, cr, dr) + hr[0];
			else if (i < 32) t += f4(br, cr, dr) + hr[1];
			else if (i < 48) t += f3(br, cr, dr) + hr[2];
			else if (i < 64) t += f2(br, cr, dr) + hr[3];
			else t += f1(br, cr, dr) + hr[4];
			t |= 0;
			t = rotl(t, sr[i]);
			t = t + er | 0;
			ar = er;
			er = dr;
			dr = rotl(cr, 10);
			cr = br;
			br = t;
		}
		t = H[1] + cl + dr | 0;
		H[1] = H[2] + dl + er | 0;
		H[2] = H[3] + el + ar | 0;
		H[3] = H[4] + al + br | 0;
		H[4] = H[0] + bl + cr | 0;
		H[0] = t;
	}
	_doFinalize() {
		const data = this._data;
		const dataWords = data.words;
		const nBitsTotal = this._nDataBytes * 8;
		const nBitsLeft = data.sigBytes * 8;
		dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
		dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
		data.sigBytes = (dataWords.length + 1) * 4;
		this._process();
		const hash = this._hash;
		const H = hash.words;
		for (let i = 0; i < 5; i += 1) {
			const H_i = H[i];
			H[i] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
		}
		return hash;
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
* const hash = RIPEMD160('message');
* const hash = RIPEMD160(wordArray);
* ```
*/
const RIPEMD160 = Hasher._createHelper(RIPEMD160Algo);
/**
* Shortcut function to the HMAC's object interface.
*
* @param message - The message to hash.
* @param key - The secret key.
* @returns The HMAC.
*
* @example
* ```js
* const hmac = HmacRIPEMD160(message, key);
* ```
*/
const HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160Algo);

//#endregion
export { HmacRIPEMD160, RIPEMD160, RIPEMD160Algo };
//# sourceMappingURL=ripemd160.mjs.map