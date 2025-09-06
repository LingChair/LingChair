import { BlockCipherMode } from "./cipher-core.mjs";

//#region src/mode-cfb.ts
function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
	const _words = words;
	let keystream;
	const iv = this._iv;
	if (iv) {
		keystream = iv.slice(0);
		this._iv = void 0;
	} else keystream = this._prevBlock;
	cipher.encryptBlock(keystream, 0);
	for (let i = 0; i < blockSize; i += 1) _words[offset + i] ^= keystream[i];
}
/**
* CFB Encryptor
*/
var CFBEncryptor = class extends BlockCipherMode {
	processBlock(words, offset) {
		const cipher = this._cipher;
		const blockSize = cipher.blockSize;
		generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
		this._prevBlock = words.slice(offset, offset + blockSize);
	}
};
/**
* CFB Decryptor
*/
var CFBDecryptor = class extends BlockCipherMode {
	processBlock(words, offset) {
		const cipher = this._cipher;
		const blockSize = cipher.blockSize;
		const thisBlock = words.slice(offset, offset + blockSize);
		generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
		this._prevBlock = thisBlock;
	}
};
/**
* Cipher Feedback block mode.
*/
var CFB = class extends BlockCipherMode {
	static Encryptor = CFBEncryptor;
	static Decryptor = CFBDecryptor;
};

//#endregion
export { CFB };
//# sourceMappingURL=mode-cfb.mjs.map