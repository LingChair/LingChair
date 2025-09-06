import { StreamCipher } from "./cipher-core.mjs";

//#region src/rc4.ts
/**
* RC4 stream cipher algorithm.
*/
var RC4Algo = class extends StreamCipher {
	static keySize = 256 / 32;
	static ivSize = 0;
	_S;
	_i;
	_j;
	generateKeystreamWord() {
		const S = this._S;
		let i = this._i;
		let j = this._j;
		let keystreamWord = 0;
		for (let n = 0; n < 4; n += 1) {
			i = (i + 1) % 256;
			j = (j + S[i]) % 256;
			const t = S[i];
			S[i] = S[j];
			S[j] = t;
			keystreamWord |= S[(S[i] + S[j]) % 256] << 24 - n * 8;
		}
		this._i = i;
		this._j = j;
		return keystreamWord;
	}
	_doReset() {
		const key = this._key;
		const keyWords = key.words;
		const keySigBytes = key.sigBytes;
		this._S = [];
		const S = this._S;
		for (let i = 0; i < 256; i += 1) S[i] = i;
		for (let i = 0, j = 0; i < 256; i += 1) {
			const keyByteIndex = i % keySigBytes;
			const keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
			j = (j + S[i] + keyByte) % 256;
			const t = S[i];
			S[i] = S[j];
			S[j] = t;
		}
		this._j = 0;
		this._i = this._j;
	}
	_doProcessBlock(M, offset) {
		const _M = M;
		_M[offset] ^= this.generateKeystreamWord();
	}
};
/**
* Shortcut functions to the cipher's object interface.
*
* @example
*
*     var ciphertext = RC4.encrypt(message, key, cfg);
*     var plaintext  = RC4.decrypt(ciphertext, key, cfg);
*/
const RC4 = StreamCipher._createHelper(RC4Algo);
/**
* Modified RC4 stream cipher algorithm.
*/
var RC4DropAlgo = class extends RC4Algo {
	constructor(xformMode, key, cfg) {
		super(xformMode, key, cfg);
		/**
		* Configuration options.
		*
		* @property {number} drop The number of keystream words to drop. Default 192
		*/
		if (this.cfg.drop === void 0) this.cfg.drop = 192;
	}
	_doReset() {
		super._doReset();
		const dropCount = this.cfg.drop || 192;
		for (let i = dropCount; i > 0; i -= 1) this.generateKeystreamWord();
	}
};
/**
* Shortcut functions to the cipher's object interface.
*
* @example
*
*     var ciphertext = RC4Drop.encrypt(message, key, cfg);
*     var plaintext  = RC4Drop.decrypt(ciphertext, key, cfg);
*/
const RC4Drop = StreamCipher._createHelper(RC4DropAlgo);

//#endregion
export { RC4, RC4Algo, RC4Drop, RC4DropAlgo };
//# sourceMappingURL=rc4.mjs.map