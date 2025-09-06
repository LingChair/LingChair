import { Hasher, Hasher32, WordArray } from "./core.mjs";

//#region src/md5.ts
const T = /* @__PURE__ */ (() => {
	const a = [];
	for (let i = 0; i < 64; i += 1) a[i] = Math.abs(Math.sin(i + 1)) * 4294967296 | 0;
	return a;
})();
/**
* MD5 round function F
*/
const FF = (a, b, c, d, x, s, t) => {
	const n = a + (b & c | ~b & d) + x + t;
	return (n << s | n >>> 32 - s) + b;
};
/**
* MD5 round function G
*/
const GG = (a, b, c, d, x, s, t) => {
	const n = a + (b & d | c & ~d) + x + t;
	return (n << s | n >>> 32 - s) + b;
};
/**
* MD5 round function H
*/
const HH = (a, b, c, d, x, s, t) => {
	const n = a + (b ^ c ^ d) + x + t;
	return (n << s | n >>> 32 - s) + b;
};
/**
* MD5 round function I
*/
const II = (a, b, c, d, x, s, t) => {
	const n = a + (c ^ (b | ~d)) + x + t;
	return (n << s | n >>> 32 - s) + b;
};
/**
* MD5 hash algorithm.
*/
var MD5Algo = class extends Hasher32 {
	_doReset() {
		this._hash = new WordArray([
			1732584193,
			4023233417,
			2562383102,
			271733878
		]);
	}
	_doProcessBlock(M, offset) {
		const _M = M;
		for (let i = 0; i < 16; i += 1) {
			const offset_i = offset + i;
			const M_offset_i = M[offset_i];
			_M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
		}
		const H = this._hash.words;
		const M_offset_0 = _M[offset + 0];
		const M_offset_1 = _M[offset + 1];
		const M_offset_2 = _M[offset + 2];
		const M_offset_3 = _M[offset + 3];
		const M_offset_4 = _M[offset + 4];
		const M_offset_5 = _M[offset + 5];
		const M_offset_6 = _M[offset + 6];
		const M_offset_7 = _M[offset + 7];
		const M_offset_8 = _M[offset + 8];
		const M_offset_9 = _M[offset + 9];
		const M_offset_10 = _M[offset + 10];
		const M_offset_11 = _M[offset + 11];
		const M_offset_12 = _M[offset + 12];
		const M_offset_13 = _M[offset + 13];
		const M_offset_14 = _M[offset + 14];
		const M_offset_15 = _M[offset + 15];
		let a = H[0];
		let b = H[1];
		let c = H[2];
		let d = H[3];
		a = FF(a, b, c, d, M_offset_0, 7, T[0]);
		d = FF(d, a, b, c, M_offset_1, 12, T[1]);
		c = FF(c, d, a, b, M_offset_2, 17, T[2]);
		b = FF(b, c, d, a, M_offset_3, 22, T[3]);
		a = FF(a, b, c, d, M_offset_4, 7, T[4]);
		d = FF(d, a, b, c, M_offset_5, 12, T[5]);
		c = FF(c, d, a, b, M_offset_6, 17, T[6]);
		b = FF(b, c, d, a, M_offset_7, 22, T[7]);
		a = FF(a, b, c, d, M_offset_8, 7, T[8]);
		d = FF(d, a, b, c, M_offset_9, 12, T[9]);
		c = FF(c, d, a, b, M_offset_10, 17, T[10]);
		b = FF(b, c, d, a, M_offset_11, 22, T[11]);
		a = FF(a, b, c, d, M_offset_12, 7, T[12]);
		d = FF(d, a, b, c, M_offset_13, 12, T[13]);
		c = FF(c, d, a, b, M_offset_14, 17, T[14]);
		b = FF(b, c, d, a, M_offset_15, 22, T[15]);
		a = GG(a, b, c, d, M_offset_1, 5, T[16]);
		d = GG(d, a, b, c, M_offset_6, 9, T[17]);
		c = GG(c, d, a, b, M_offset_11, 14, T[18]);
		b = GG(b, c, d, a, M_offset_0, 20, T[19]);
		a = GG(a, b, c, d, M_offset_5, 5, T[20]);
		d = GG(d, a, b, c, M_offset_10, 9, T[21]);
		c = GG(c, d, a, b, M_offset_15, 14, T[22]);
		b = GG(b, c, d, a, M_offset_4, 20, T[23]);
		a = GG(a, b, c, d, M_offset_9, 5, T[24]);
		d = GG(d, a, b, c, M_offset_14, 9, T[25]);
		c = GG(c, d, a, b, M_offset_3, 14, T[26]);
		b = GG(b, c, d, a, M_offset_8, 20, T[27]);
		a = GG(a, b, c, d, M_offset_13, 5, T[28]);
		d = GG(d, a, b, c, M_offset_2, 9, T[29]);
		c = GG(c, d, a, b, M_offset_7, 14, T[30]);
		b = GG(b, c, d, a, M_offset_12, 20, T[31]);
		a = HH(a, b, c, d, M_offset_5, 4, T[32]);
		d = HH(d, a, b, c, M_offset_8, 11, T[33]);
		c = HH(c, d, a, b, M_offset_11, 16, T[34]);
		b = HH(b, c, d, a, M_offset_14, 23, T[35]);
		a = HH(a, b, c, d, M_offset_1, 4, T[36]);
		d = HH(d, a, b, c, M_offset_4, 11, T[37]);
		c = HH(c, d, a, b, M_offset_7, 16, T[38]);
		b = HH(b, c, d, a, M_offset_10, 23, T[39]);
		a = HH(a, b, c, d, M_offset_13, 4, T[40]);
		d = HH(d, a, b, c, M_offset_0, 11, T[41]);
		c = HH(c, d, a, b, M_offset_3, 16, T[42]);
		b = HH(b, c, d, a, M_offset_6, 23, T[43]);
		a = HH(a, b, c, d, M_offset_9, 4, T[44]);
		d = HH(d, a, b, c, M_offset_12, 11, T[45]);
		c = HH(c, d, a, b, M_offset_15, 16, T[46]);
		b = HH(b, c, d, a, M_offset_2, 23, T[47]);
		a = II(a, b, c, d, M_offset_0, 6, T[48]);
		d = II(d, a, b, c, M_offset_7, 10, T[49]);
		c = II(c, d, a, b, M_offset_14, 15, T[50]);
		b = II(b, c, d, a, M_offset_5, 21, T[51]);
		a = II(a, b, c, d, M_offset_12, 6, T[52]);
		d = II(d, a, b, c, M_offset_3, 10, T[53]);
		c = II(c, d, a, b, M_offset_10, 15, T[54]);
		b = II(b, c, d, a, M_offset_1, 21, T[55]);
		a = II(a, b, c, d, M_offset_8, 6, T[56]);
		d = II(d, a, b, c, M_offset_15, 10, T[57]);
		c = II(c, d, a, b, M_offset_6, 15, T[58]);
		b = II(b, c, d, a, M_offset_13, 21, T[59]);
		a = II(a, b, c, d, M_offset_4, 6, T[60]);
		d = II(d, a, b, c, M_offset_11, 10, T[61]);
		c = II(c, d, a, b, M_offset_2, 15, T[62]);
		b = II(b, c, d, a, M_offset_9, 21, T[63]);
		H[0] = H[0] + a | 0;
		H[1] = H[1] + b | 0;
		H[2] = H[2] + c | 0;
		H[3] = H[3] + d | 0;
	}
	_doFinalize() {
		const data = this._data;
		const dataWords = data.words;
		const nBitsTotal = this._nDataBytes * 8;
		const nBitsLeft = data.sigBytes * 8;
		dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
		const nBitsTotalH = Math.floor(nBitsTotal / 4294967296);
		const nBitsTotalL = nBitsTotal;
		dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
		dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
		data.sigBytes = (dataWords.length + 1) * 4;
		this._process();
		const hash = this._hash;
		const H = hash.words;
		for (let i = 0; i < 4; i += 1) {
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
* const hash = MD5('message');
* const hash = MD5(wordArray);
* ```
*/
const MD5 = Hasher._createHelper(MD5Algo);
/**
* Shortcut function to the HMAC's object interface.
*
* @param message - The message to hash.
* @param key - The secret key.
* @returns The HMAC.
*
* @example
* ```js
* const hmac = HmacMD5(message, key);
* ```
*/
const HmacMD5 = Hasher._createHmacHelper(MD5Algo);

//#endregion
export { HmacMD5, MD5, MD5Algo };
//# sourceMappingURL=md5.mjs.map