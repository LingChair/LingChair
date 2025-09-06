import { BlockCipherMode } from "./cipher-core.mjs";

//#region src/mode-ofb.ts
/**
* OFB Encryptor/Decryptor (same operation)
*/
var OFBMode = class extends BlockCipherMode {
	/** Keystream for OFB mode */
	_keystream;
	processBlock(words, offset) {
		const _words = words;
		const cipher = this._cipher;
		const blockSize = cipher.blockSize;
		const iv = this._iv;
		let keystream = this._keystream;
		if (iv) {
			this._keystream = iv.slice(0);
			keystream = this._keystream;
			this._iv = void 0;
		} else if (!keystream) {
			this._keystream = new Array(blockSize).fill(0);
			keystream = this._keystream;
		}
		cipher.encryptBlock(keystream, 0);
		for (let i = 0; i < blockSize; i += 1) _words[offset + i] ^= keystream[i];
	}
};
/**
* Output Feedback block mode.
*/
var OFB = class extends BlockCipherMode {
	/** Keystream for OFB mode */
	_keystream;
	static Encryptor = OFBMode;
	static Decryptor = OFBMode;
};

//#endregion
export { OFB };
//# sourceMappingURL=mode-ofb.mjs.map