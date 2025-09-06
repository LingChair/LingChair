import { Base, BufferedBlockAlgorithm, Hex, WordArray } from "./core.mjs";
import { Base64 } from "./enc-base64.mjs";
import { EvpKDFAlgo } from "./evpkdf.mjs";

//#region src/cipher-core.ts
/**
* Abstract base cipher template.
* Provides the foundation for all encryption and decryption algorithms.
* 
* @property keySize - This cipher's key size in words (default: 4 = 128 bits)
* @property ivSize - This cipher's IV size in words (default: 4 = 128 bits)
* @property _ENC_XFORM_MODE - A constant representing encryption mode
* @property _DEC_XFORM_MODE - A constant representing decryption mode
*/
var Cipher = class Cipher extends BufferedBlockAlgorithm {
	/** Encryption mode constant */
	static _ENC_XFORM_MODE = 1;
	/** Decryption mode constant */
	static _DEC_XFORM_MODE = 2;
	/** Default key size in words (128 bits) */
	static keySize = 128 / 32;
	/** Default IV size in words (128 bits) */
	static ivSize = 128 / 32;
	/** Configuration options */
	cfg;
	/** Transform mode (encryption or decryption) */
	_xformMode;
	/** The key */
	_key;
	/** Block size in words */
	blockSize = 128 / 32;
	/**
	* Initializes a newly created cipher.
	* 
	* @param xformMode - Either the encryption or decryption transformation mode constant
	* @param key - The key
	* @param cfg - Configuration options to use for this operation
	* @example
	* ```javascript
	* const cipher = new AESAlgo(
	*   Cipher._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray }
	* );
	* ```
	*/
	constructor(xformMode, key, cfg) {
		super();
		this.cfg = Object.assign({}, cfg);
		this._xformMode = xformMode;
		this._key = key;
	}
	/**
	* Creates this cipher in encryption mode.
	* 
	* @param key - The key
	* @param cfg - Configuration options to use for this operation
	* @returns A cipher instance
	* @static
	* @example
	* ```javascript
	* const cipher = AESAlgo.createEncryptor(keyWordArray, { iv: ivWordArray });
	* ```
	*/
	static createEncryptor(key, cfg) {
		return this.create(Cipher._ENC_XFORM_MODE, key, cfg);
	}
	/**
	* Creates this cipher in decryption mode.
	* 
	* @param key - The key
	* @param cfg - Configuration options to use for this operation
	* @returns A cipher instance
	* @static
	* @example
	* ```javascript
	* const cipher = AESAlgo.createDecryptor(keyWordArray, { iv: ivWordArray });
	* ```
	*/
	static createDecryptor(key, cfg) {
		return this.create(Cipher._DEC_XFORM_MODE, key, cfg);
	}
	static create(...args) {
		if (args.length >= 2 && typeof args[0] === "number") {
			const [xformMode, key, cfg] = args;
			const instance = new this(xformMode, key, cfg);
			instance.reset();
			return instance;
		} else return new this(...args);
	}
	/**
	* Creates shortcut functions to a cipher's object interface.
	* 
	* @param SubCipher - The cipher to create a helper for
	* @returns An object with encrypt and decrypt shortcut functions
	* @static
	* @example
	* ```javascript
	* const AES = Cipher._createHelper(AESAlgo);
	* ```
	*/
	static _createHelper(SubCipher) {
		const selectCipherStrategy = (key) => {
			if (typeof key === "string") return PasswordBasedCipher;
			return SerializableCipher;
		};
		return {
			encrypt(message, key, cfg) {
				return selectCipherStrategy(key).encrypt(SubCipher, message, key, cfg);
			},
			decrypt(ciphertext, key, cfg) {
				return selectCipherStrategy(key).decrypt(SubCipher, ciphertext, key, cfg);
			}
		};
	}
	/**
	* Resets this cipher to its initial state.
	* 
	* @example
	* ```javascript
	* cipher.reset();
	* ```
	*/
	reset() {
		super.reset();
		this._doReset();
	}
	/**
	* Adds data to be encrypted or decrypted.
	* 
	* @param dataUpdate - The data to encrypt or decrypt
	* @returns The data after processing
	* @example
	* ```javascript
	* const encrypted = cipher.process('data');
	* const encrypted = cipher.process(wordArray);
	* ```
	*/
	process(dataUpdate) {
		this._append(dataUpdate);
		return this._process();
	}
	/**
	* Finalizes the encryption or decryption process.
	* Note that the finalize operation is effectively a destructive, read-once operation.
	* 
	* @param dataUpdate - The final data to encrypt or decrypt
	* @returns The data after final processing
	* @example
	* ```javascript
	* const encrypted = cipher.finalize();
	* const encrypted = cipher.finalize('data');
	* const encrypted = cipher.finalize(wordArray);
	* ```
	*/
	finalize(dataUpdate) {
		if (dataUpdate) this._append(dataUpdate);
		const finalProcessedData = this._doFinalize();
		return finalProcessedData;
	}
};
/**
* Abstract base stream cipher template.
* Stream ciphers process data one unit at a time rather than in blocks.
* 
* @property blockSize - The number of 32-bit words this cipher operates on (default: 1 = 32 bits)
*/
var StreamCipher = class extends Cipher {
	blockSize = 1;
	constructor(xformMode, key, cfg) {
		super(xformMode, key, cfg);
		this.blockSize = 1;
	}
	_doFinalize() {
		const finalProcessedBlocks = this._process(true);
		return finalProcessedBlocks;
	}
};
/**
* Abstract base block cipher mode template.
* Defines how multiple blocks are processed together.
*/
var BlockCipherMode = class extends Base {
	/** The cipher instance */
	_cipher;
	/** The initialization vector */
	_iv;
	/** The previous block (for chaining modes) */
	_prevBlock;
	/**
	* Initializes a newly created mode.
	* 
	* @param cipher - A block cipher instance
	* @param iv - The IV words
	* @example
	* ```javascript
	* const mode = new CBCMode(cipher, iv.words);
	* ```
	*/
	constructor(cipher, iv) {
		super();
		this._cipher = cipher;
		this._iv = iv;
	}
	/**
	* Creates this mode for encryption.
	* 
	* @param cipher - A block cipher instance
	* @param iv - The IV words
	* @returns The mode instance
	* @static
	* @example
	* ```javascript
	* const mode = CBC.createEncryptor(cipher, iv.words);
	* ```
	*/
	static createEncryptor(cipher, iv) {
		return this.Encryptor.create(cipher, iv);
	}
	/**
	* Creates this mode for decryption.
	* 
	* @param cipher - A block cipher instance
	* @param iv - The IV words
	* @returns The mode instance
	* @static
	* @example
	* ```javascript
	* const mode = CBC.createDecryptor(cipher, iv.words);
	* ```
	*/
	static createDecryptor(cipher, iv) {
		return this.Decryptor.create(cipher, iv);
	}
	/**
	* Process a block of data
	* Must be implemented by concrete modes
	*/
	processBlock(_words, _offset) {}
};
/**
* XOR blocks for cipher block chaining
* @private
*/
function xorBlock(words, offset, blockSize) {
	const _words = words;
	let block;
	const iv = this._iv;
	if (iv) {
		block = iv;
		this._iv = void 0;
	} else block = this._prevBlock;
	if (block) for (let i = 0; i < blockSize; i += 1) _words[offset + i] ^= block[i];
}
/**
* CBC Encryptor
*/
var CBCEncryptor = class extends BlockCipherMode {
	/**
	* Processes the data block at offset.
	* 
	* @param words - The data words to operate on
	* @param offset - The offset where the block starts
	* @example
	* ```javascript
	* mode.processBlock(data.words, offset);
	* ```
	*/
	processBlock(words, offset) {
		const cipher = this._cipher;
		const blockSize = cipher.blockSize;
		xorBlock.call(this, words, offset, blockSize);
		cipher.encryptBlock(words, offset);
		this._prevBlock = words.slice(offset, offset + blockSize);
	}
};
/**
* CBC Decryptor
*/
var CBCDecryptor = class extends BlockCipherMode {
	/**
	* Processes the data block at offset.
	* 
	* @param words - The data words to operate on
	* @param offset - The offset where the block starts
	* @example
	* ```javascript
	* mode.processBlock(data.words, offset);
	* ```
	*/
	processBlock(words, offset) {
		const cipher = this._cipher;
		const blockSize = cipher.blockSize;
		const thisBlock = words.slice(offset, offset + blockSize);
		cipher.decryptBlock(words, offset);
		xorBlock.call(this, words, offset, blockSize);
		this._prevBlock = thisBlock;
	}
};
/**
* Cipher Block Chaining mode.
* Each block is XORed with the previous ciphertext block before encryption.
*/
var CBC = class extends BlockCipherMode {
	/** CBC Encryptor */
	static Encryptor = CBCEncryptor;
	/** CBC Decryptor */
	static Decryptor = CBCDecryptor;
};
/**
* PKCS #5/7 padding strategy.
* Pads data with bytes all of the same value as the count of padding bytes.
*/
const Pkcs7 = {
	pad(data, blockSize) {
		const blockSizeBytes = blockSize * 4;
		const nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
		const paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
		const paddingWords = [];
		for (let i = 0; i < nPaddingBytes; i += 4) paddingWords.push(paddingWord);
		const padding = WordArray.create(paddingWords, nPaddingBytes);
		data.concat(padding);
	},
	unpad(data) {
		const nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
		data.sigBytes -= nPaddingBytes;
	}
};
/**
* Abstract base block cipher template.
* Block ciphers process data in fixed-size blocks.
* 
* @property blockSize - The number of 32-bit words this cipher operates on (default: 4 = 128 bits)
*/
var BlockCipher = class extends Cipher {
	/** Block mode instance */
	_mode;
	/**
	* Initializes a newly created block cipher.
	* 
	* @param xformMode - Transform mode
	* @param key - The key
	* @param cfg - Configuration options
	*/
	constructor(xformMode, key, cfg) {
		super(xformMode, key, Object.assign({
			mode: CBC,
			padding: Pkcs7
		}, cfg));
		this.blockSize = 128 / 32;
	}
	reset() {
		super.reset();
		const { cfg } = this;
		const { iv, mode } = cfg;
		let modeCreator;
		if (this._xformMode === this.constructor._ENC_XFORM_MODE) modeCreator = mode?.createEncryptor;
		else {
			modeCreator = mode?.createDecryptor;
			this._minBufferSize = 1;
		}
		if (modeCreator && mode) {
			this._mode = modeCreator.call(mode, this, iv?.words);
			this._mode.__creator = modeCreator;
		}
	}
	_doProcessBlock(words, offset) {
		this._mode?.processBlock(words, offset);
	}
	_doFinalize() {
		let finalProcessedBlocks;
		const { padding } = this.cfg;
		if (this._xformMode === this.constructor._ENC_XFORM_MODE) {
			if (padding) padding.pad(this._data, this.blockSize);
			finalProcessedBlocks = this._process(true);
		} else {
			finalProcessedBlocks = this._process(true);
			if (padding) padding.unpad(finalProcessedBlocks);
		}
		return finalProcessedBlocks;
	}
};
/**
* A collection of cipher parameters.
* Encapsulates all the parameters used in a cipher operation.
* 
* @property ciphertext - The raw ciphertext
* @property key - The key to this ciphertext
* @property iv - The IV used in the ciphering operation
* @property salt - The salt used with a key derivation function
* @property algorithm - The cipher algorithm
* @property mode - The block mode used in the ciphering operation
* @property padding - The padding scheme used in the ciphering operation
* @property blockSize - The block size of the cipher
* @property formatter - The default formatting strategy
*/
var CipherParams = class CipherParams extends Base {
	ciphertext;
	key;
	iv;
	salt;
	algorithm;
	mode;
	padding;
	blockSize;
	formatter;
	/**
	* Initializes a newly created cipher params object.
	* 
	* @param cipherParams - An object with any of the possible cipher parameters
	* @example
	* ```javascript
	* const cipherParams = new CipherParams({
	*   ciphertext: ciphertextWordArray,
	*   key: keyWordArray,
	*   iv: ivWordArray,
	*   salt: saltWordArray,
	*   algorithm: AESAlgo,
	*   mode: CBC,
	*   padding: Pkcs7,
	*   blockSize: 4,
	*   formatter: OpenSSLFormatter
	* });
	* ```
	*/
	constructor(cipherParams) {
		super();
		if (cipherParams) this.mixIn(cipherParams);
		if (!this.formatter) this.formatter = OpenSSLFormatter;
	}
	static create(...args) {
		const [cipherParams] = args;
		return new CipherParams(cipherParams);
	}
	/**
	* Converts this cipher params object to a string.
	* 
	* @param formatter - The formatting strategy to use
	* @returns The stringified cipher params
	* @throws Error if neither the formatter nor the default formatter is set
	* @example
	* ```javascript
	* const string = cipherParams.toString();
	* const string = cipherParams.toString(OpenSSLFormatter);
	* ```
	*/
	toString(formatter) {
		const fmt = formatter || this.formatter;
		if (!fmt) throw new Error("cipher params formatter required");
		return fmt.stringify(this);
	}
};
/**
* OpenSSL formatting strategy.
* Formats cipher params in OpenSSL-compatible format.
*/
const OpenSSLFormatter = {
	stringify(cipherParams) {
		let wordArray;
		const { ciphertext, salt } = cipherParams;
		if (salt && ciphertext) wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
		else if (ciphertext) wordArray = ciphertext;
		else wordArray = new WordArray();
		return wordArray.toString(Base64);
	},
	parse(openSSLStr) {
		let salt;
		const ciphertext = Base64.parse(openSSLStr);
		const ciphertextWords = ciphertext.words;
		if (ciphertextWords[0] === 1398893684 && ciphertextWords[1] === 1701076831) {
			salt = WordArray.create(ciphertextWords.slice(2, 4));
			ciphertextWords.splice(0, 4);
			ciphertext.sigBytes -= 16;
		}
		return CipherParams.create({
			ciphertext,
			salt
		});
	}
};
/**
* A cipher wrapper that returns ciphertext as a serializable cipher params object.
* Handles the serialization and deserialization of cipher operations.
*/
var SerializableCipher = class extends Base {
	/** Configuration options */
	static cfg = { format: OpenSSLFormatter };
	/**
	* Encrypts a message.
	* 
	* @param cipher - The cipher algorithm to use
	* @param message - The message to encrypt
	* @param key - The key
	* @param cfg - Configuration options to use for this operation
	* @returns A cipher params object
	* @static
	* @example
	* ```javascript
	* const ciphertextParams = SerializableCipher.encrypt(AESAlgo, message, key);
	* const ciphertextParams = SerializableCipher.encrypt(AESAlgo, message, key, { iv: iv });
	* ```
	*/
	static encrypt(cipher, message, key, cfg) {
		const _cfg = Object.assign({}, this.cfg, cfg);
		const encryptor = cipher.createEncryptor(key, _cfg);
		const ciphertext = encryptor.finalize(message);
		const cipherCfg = encryptor.cfg;
		return CipherParams.create({
			ciphertext,
			key,
			iv: cipherCfg.iv,
			algorithm: cipher,
			mode: cipherCfg.mode,
			padding: cipherCfg.padding,
			blockSize: encryptor.blockSize,
			formatter: _cfg.format || OpenSSLFormatter
		});
	}
	/**
	* Decrypts serialized ciphertext.
	* 
	* @param cipher - The cipher algorithm to use
	* @param ciphertext - The ciphertext to decrypt
	* @param key - The key
	* @param cfg - Configuration options to use for this operation
	* @returns The plaintext
	* @static
	* @example
	* ```javascript
	* const plaintext = SerializableCipher.decrypt(AESAlgo, formattedCiphertext, key, { iv: iv });
	* const plaintext = SerializableCipher.decrypt(AESAlgo, ciphertextParams, key, { iv: iv });
	* ```
	*/
	static decrypt(cipher, ciphertext, key, cfg) {
		const _cfg = Object.assign({}, this.cfg, cfg);
		const _ciphertext = this._parse(ciphertext, _cfg.format);
		const plaintext = cipher.createDecryptor(key, _cfg).finalize(_ciphertext.ciphertext);
		return plaintext;
	}
	/**
	* Converts serialized ciphertext to CipherParams.
	* 
	* @param ciphertext - The ciphertext
	* @param format - The formatting strategy to use to parse serialized ciphertext
	* @returns The unserialized ciphertext
	* @static
	* @private
	*/
	static _parse(ciphertext, format) {
		if (typeof ciphertext === "string") {
			if (!format) throw new Error("Format required to parse string");
			return format.parse(ciphertext, this);
		}
		if (ciphertext instanceof CipherParams) return ciphertext;
		return new CipherParams(ciphertext);
	}
};
/**
* OpenSSL key derivation function.
* Derives a key and IV from a password using the OpenSSL method.
*/
const OpenSSLKdf = { execute(password, keySize, ivSize, salt, hasher) {
	let _salt;
	if (!salt) _salt = WordArray.random(64 / 8);
	else if (typeof salt === "string") _salt = Hex.parse(salt);
	else _salt = salt;
	let key;
	if (!hasher) key = EvpKDFAlgo.create({ keySize: keySize + ivSize }).compute(password, _salt);
	else key = EvpKDFAlgo.create({
		keySize: keySize + ivSize,
		hasher
	}).compute(password, _salt);
	const iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
	key.sigBytes = keySize * 4;
	return CipherParams.create({
		key,
		iv,
		salt: _salt
	});
} };
/**
* A serializable cipher wrapper that derives the key from a password.
* Returns ciphertext as a serializable cipher params object.
*/
var PasswordBasedCipher = class extends SerializableCipher {
	/** Configuration options */
	static cfg = Object.assign({}, SerializableCipher.cfg, { kdf: OpenSSLKdf });
	/**
	* Encrypts a message using a password.
	* 
	* @param cipher - The cipher algorithm to use
	* @param message - The message to encrypt
	* @param password - The password
	* @param cfg - Configuration options to use for this operation
	* @returns A cipher params object
	* @static
	* @example
	* ```javascript
	* const ciphertextParams = PasswordBasedCipher.encrypt(AESAlgo, message, 'password');
	* ```
	*/
	static encrypt(cipher, message, password, cfg) {
		const _cfg = Object.assign({}, this.cfg, cfg);
		if (!_cfg.kdf) throw new Error("KDF required for password-based encryption");
		const derivedParams = _cfg.kdf.execute(password, cipher.keySize || cipher.keySize, cipher.ivSize || cipher.ivSize, _cfg.salt, _cfg.hasher);
		_cfg.iv = derivedParams.iv;
		const ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, _cfg);
		ciphertext.salt = derivedParams.salt;
		return ciphertext;
	}
	/**
	* Decrypts serialized ciphertext using a password.
	* 
	* @param cipher - The cipher algorithm to use
	* @param ciphertext - The ciphertext to decrypt
	* @param password - The password
	* @param cfg - Configuration options to use for this operation
	* @returns The plaintext
	* @static
	* @example
	* ```javascript
	* const plaintext = PasswordBasedCipher.decrypt(AESAlgo, formattedCiphertext, 'password');
	* ```
	*/
	static decrypt(cipher, ciphertext, password, cfg) {
		const _cfg = Object.assign({}, this.cfg, cfg);
		const _ciphertext = this._parse(ciphertext, _cfg.format);
		if (!_cfg.kdf) throw new Error("KDF required for password-based decryption");
		const derivedParams = _cfg.kdf.execute(password, cipher.keySize || cipher.keySize, cipher.ivSize || cipher.ivSize, _ciphertext.salt, _cfg.hasher);
		_cfg.iv = derivedParams.iv;
		const plaintext = SerializableCipher.decrypt.call(this, cipher, _ciphertext, derivedParams.key, _cfg);
		return plaintext;
	}
};

//#endregion
export { BlockCipher, BlockCipherMode, CBC, Cipher, CipherParams, OpenSSLFormatter, OpenSSLKdf, PasswordBasedCipher, Pkcs7, SerializableCipher, StreamCipher };
//# sourceMappingURL=cipher-core.mjs.map