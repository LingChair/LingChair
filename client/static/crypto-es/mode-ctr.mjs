import { BlockCipherMode } from "./cipher-core.mjs";

//#region src/mode-ctr.ts
/**
* CTR Encryptor/Decryptor (same operation)
*/
var CTRMode = class extends BlockCipherMode {
	/** Counter for CTR mode */
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
		const keystream = counter.slice(0);
		cipher.encryptBlock(keystream, 0);
		counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
		for (let i = 0; i < blockSize; i += 1) _words[offset + i] ^= keystream[i];
	}
};
/**
* Counter block mode.
*/
var CTR = class extends BlockCipherMode {
	/** Counter for CTR mode */
	_counter;
	static Encryptor = CTRMode;
	static Decryptor = CTRMode;
};

//#endregion
export { CTR };
//# sourceMappingURL=mode-ctr.mjs.map