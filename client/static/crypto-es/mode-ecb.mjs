import { BlockCipherMode } from "./cipher-core.mjs";

//#region src/mode-ecb.ts
/**
* ECB Encryptor
*/
var ECBEncryptor = class extends BlockCipherMode {
	processBlock(words, offset) {
		this._cipher.encryptBlock(words, offset);
	}
};
/**
* ECB Decryptor
*/
var ECBDecryptor = class extends BlockCipherMode {
	processBlock(words, offset) {
		this._cipher.decryptBlock(words, offset);
	}
};
/**
* Electronic Codebook block mode.
*/
var ECB = class extends BlockCipherMode {
	static Encryptor = ECBEncryptor;
	static Decryptor = ECBDecryptor;
};

//#endregion
export { ECB };
//# sourceMappingURL=mode-ecb.mjs.map