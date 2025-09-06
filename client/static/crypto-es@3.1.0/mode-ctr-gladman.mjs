import { BlockCipherMode } from "./cipher-core.mjs";

//#region src/mode-ctr-gladman.ts
const incWord = (word) => {
	let _word = word;
	if ((word >> 24 & 255) === 255) {
		let b1 = word >> 16 & 255;
		let b2 = word >> 8 & 255;
		let b3 = word & 255;
		if (b1 === 255) {
			b1 = 0;
			if (b2 === 255) {
				b2 = 0;
				if (b3 === 255) b3 = 0;
				else b3 += 1;
			} else b2 += 1;
		} else b1 += 1;
		_word = 0;
		_word += b1 << 16;
		_word += b2 << 8;
		_word += b3;
	} else _word += 1 << 24;
	return _word;
};
const incCounter = (counter) => {
	const _counter = counter;
	_counter[0] = incWord(_counter[0]);
	if (_counter[0] === 0) _counter[1] = incWord(_counter[1]);
	return _counter;
};
/**
* CTRGladman Encryptor/Decryptor (same operation)
*/
var CTRGladmanMode = class extends BlockCipherMode {
	/** Counter for CTR Gladman mode */
	_counter;
	processBlock(words, offset) {
		const _words = words;
		const cipher = this._cipher;
		const blockSize = cipher.blockSize;
		const iv = this._iv;
		let counter = this._counter;
		if (iv) {
			this._counter = iv.slice(0);
			counter = this._counter;
			this._iv = void 0;
		}
		incCounter(counter);
		const keystream = counter.slice(0);
		cipher.encryptBlock(keystream, 0);
		for (let i = 0; i < blockSize; i += 1) _words[offset + i] ^= keystream[i];
	}
};
/** @preserve
* Counter block mode compatible with  Dr Brian Gladman fileenc.c
* derived from CTR mode
* Jan Hruby jhruby.web@gmail.com
*/
var CTRGladman = class extends BlockCipherMode {
	/** Counter for CTR Gladman mode */
	_counter;
	static Encryptor = CTRGladmanMode;
	static Decryptor = CTRGladmanMode;
};

//#endregion
export { CTRGladman };
//# sourceMappingURL=mode-ctr-gladman.mjs.map