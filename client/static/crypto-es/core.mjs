//#region src/core.ts
const crypto = (typeof globalThis !== "undefined" ? globalThis : void 0)?.crypto || (typeof global !== "undefined" ? global : void 0)?.crypto || (typeof window !== "undefined" ? window : void 0)?.crypto || (typeof self !== "undefined" ? self : void 0)?.crypto || (typeof frames !== "undefined" ? frames : void 0)?.[0]?.crypto;
/**
* Random word array generator function
*/
let randomWordArray;
if (crypto) randomWordArray = (nBytes) => {
	const words = [];
	for (let i = 0; i < nBytes; i += 4) words.push(crypto.getRandomValues(new Uint32Array(1))[0]);
	return new WordArray(words, nBytes);
};
else randomWordArray = (nBytes) => {
	const words = [];
	const r = (m_w) => {
		let _m_w = m_w;
		let _m_z = 987654321;
		const mask = 4294967295;
		return () => {
			_m_z = 36969 * (_m_z & 65535) + (_m_z >> 16) & mask;
			_m_w = 18e3 * (_m_w & 65535) + (_m_w >> 16) & mask;
			let result = (_m_z << 16) + _m_w & mask;
			result /= 4294967296;
			result += .5;
			return result * (Math.random() > .5 ? 1 : -1);
		};
	};
	let rcache;
	for (let i = 0; i < nBytes; i += 4) {
		const _r = r((rcache || Math.random()) * 4294967296);
		rcache = _r() * 987654071;
		words.push(_r() * 4294967296 | 0);
	}
	return new WordArray(words, nBytes);
};
/**
* Base class for inheritance.
* Provides basic object-oriented programming utilities.
*/
var Base = class {
	/**
	* Creates a new instance of this class with the provided arguments.
	* This is a factory method that provides an alternative to using 'new'.
	* 
	* @param args - Arguments to pass to the constructor
	* @returns A new instance of this class
	* @static
	* @example
	* ```javascript
	* const instance = MyType.create(arg1, arg2);
	* ```
	*/
	static create(...args) {
		return new this(...args);
	}
	/**
	* Copies properties from the provided object into this instance.
	* Performs a shallow merge of properties.
	* 
	* @param properties - The properties to mix in
	* @returns This instance for method chaining
	* @example
	* ```javascript
	* instance.mixIn({ field: 'value', another: 123 });
	* ```
	*/
	mixIn(properties) {
		return Object.assign(this, properties);
	}
	/**
	* Creates a deep copy of this object.
	* 
	* @returns A clone of this instance
	* @example
	* ```javascript
	* const clone = instance.clone();
	* ```
	*/
	clone() {
		const clone = new this.constructor();
		Object.assign(clone, this);
		return clone;
	}
};
/**
* An array of 32-bit words.
* This is the core data structure used throughout the library for representing binary data.
* 
* @property words - The array of 32-bit words
* @property sigBytes - The number of significant bytes in this word array
*/
var WordArray = class extends Base {
	/** The array of 32-bit words */
	words;
	/** The number of significant bytes in this word array */
	sigBytes;
	/**
	* Initializes a newly created word array.
	* Can accept various input formats including regular arrays, typed arrays, and ArrayBuffers.
	* 
	* @param words - An array of 32-bit words, typed array, or ArrayBuffer
	* @param sigBytes - The number of significant bytes in the words (defaults to words.length * 4)
	* @example
	* ```javascript
	* const wordArray = new WordArray();
	* const wordArray = new WordArray([0x00010203, 0x04050607]);
	* const wordArray = new WordArray([0x00010203, 0x04050607], 6);
	* const wordArray = new WordArray(new Uint8Array([1, 2, 3, 4]));
	* ```
	*/
	constructor(words = [], sigBytes) {
		super();
		if (words instanceof ArrayBuffer) {
			const typedArray = new Uint8Array(words);
			this._initFromUint8Array(typedArray);
			return;
		}
		if (ArrayBuffer.isView(words)) {
			let uint8Array;
			if (words instanceof Uint8Array) uint8Array = words;
			else uint8Array = new Uint8Array(words.buffer, words.byteOffset, words.byteLength);
			this._initFromUint8Array(uint8Array);
			return;
		}
		this.words = words;
		this.sigBytes = sigBytes !== void 0 ? sigBytes : this.words.length * 4;
	}
	/**
	* Initialize from Uint8Array
	* @private
	*/
	_initFromUint8Array(typedArray) {
		const typedArrayByteLength = typedArray.byteLength;
		const words = [];
		for (let i = 0; i < typedArrayByteLength; i += 1) words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
		this.words = words;
		this.sigBytes = typedArrayByteLength;
	}
	/**
	* Creates a word array filled with cryptographically strong random bytes.
	* Uses Web Crypto API if available, falls back to Math.random() if not.
	* 
	* @param nBytes - The number of random bytes to generate
	* @returns The random word array
	* @static
	* @example
	* ```javascript
	* const randomBytes = WordArray.random(16); // Generate 16 random bytes
	* ```
	*/
	static random = randomWordArray;
	/**
	* Converts this word array to a string using the specified encoding.
	* 
	* @param encoder - The encoding strategy to use (defaults to Hex)
	* @returns The stringified word array
	* @example
	* ```javascript
	* const hexString = wordArray.toString();
	* const base64String = wordArray.toString(Base64);
	* const utf8String = wordArray.toString(Utf8);
	* ```
	*/
	toString(encoder = Hex) {
		return encoder.stringify(this);
	}
	/**
	* Concatenates a word array to this word array.
	* Modifies this word array in place.
	* 
	* @param wordArray - The word array to append
	* @returns This word array for method chaining
	* @example
	* ```javascript
	* wordArray1.concat(wordArray2);
	* const combined = wordArray1.concat(wordArray2).concat(wordArray3);
	* ```
	*/
	concat(wordArray) {
		const thisWords = this.words;
		const thatWords = wordArray.words;
		const thisSigBytes = this.sigBytes;
		const thatSigBytes = wordArray.sigBytes;
		this.clamp();
		if (thisSigBytes % 4) for (let i = 0; i < thatSigBytes; i += 1) {
			const thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 255;
			thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
		}
		else for (let i = 0; i < thatSigBytes; i += 4) thisWords[thisSigBytes + i >>> 2] = thatWords[i >>> 2];
		this.sigBytes += thatSigBytes;
		return this;
	}
	/**
	* Removes insignificant bits from the end of the word array.
	* This ensures the word array only contains the exact number of significant bytes.
	* 
	* @example
	* ```javascript
	* wordArray.clamp();
	* ```
	*/
	clamp() {
		const { words, sigBytes } = this;
		words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
		words.length = Math.ceil(sigBytes / 4);
	}
	/**
	* Creates a copy of this word array.
	* 
	* @returns The cloned word array
	* @example
	* ```javascript
	* const clone = wordArray.clone();
	* ```
	*/
	clone() {
		const clone = super.clone();
		clone.words = this.words.slice(0);
		return clone;
	}
};
/**
* Hex encoding strategy.
* Converts between word arrays and hexadecimal strings.
*/
const Hex = {
	stringify(wordArray) {
		const { words, sigBytes } = wordArray;
		const hexChars = [];
		for (let i = 0; i < sigBytes; i += 1) {
			const bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
			hexChars.push((bite >>> 4).toString(16));
			hexChars.push((bite & 15).toString(16));
		}
		return hexChars.join("");
	},
	parse(hexStr) {
		const hexStrLength = hexStr.length;
		const words = [];
		for (let i = 0; i < hexStrLength; i += 2) words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
		return new WordArray(words, hexStrLength / 2);
	}
};
/**
* Latin1 encoding strategy.
* Converts between word arrays and Latin-1 (ISO-8859-1) strings.
*/
const Latin1 = {
	stringify(wordArray) {
		const { words, sigBytes } = wordArray;
		const latin1Chars = [];
		for (let i = 0; i < sigBytes; i += 1) {
			const bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
			latin1Chars.push(String.fromCharCode(bite));
		}
		return latin1Chars.join("");
	},
	parse(latin1Str) {
		const latin1StrLength = latin1Str.length;
		const words = [];
		for (let i = 0; i < latin1StrLength; i += 1) words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
		return new WordArray(words, latin1StrLength);
	}
};
/**
* UTF-8 encoding strategy.
* Converts between word arrays and UTF-8 strings.
*/
const Utf8 = {
	stringify(wordArray) {
		try {
			return decodeURIComponent(escape(Latin1.stringify(wordArray)));
		} catch (e) {
			throw new Error("Malformed UTF-8 data");
		}
	},
	parse(utf8Str) {
		return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	}
};
/**
* Abstract buffered block algorithm template.
* Provides a base implementation for algorithms that process data in fixed-size blocks.
* 
* @property _minBufferSize - The number of blocks that should be kept unprocessed in the buffer
*/
var BufferedBlockAlgorithm = class extends Base {
	/** The number of blocks that should be kept unprocessed in the buffer */
	_minBufferSize = 0;
	/** The data buffer */
	_data;
	/** The number of bytes in the data buffer */
	_nDataBytes;
	constructor() {
		super();
	}
	/**
	* Resets this block algorithm's data buffer to its initial state.
	* 
	* @example
	* ```javascript
	* bufferedBlockAlgorithm.reset();
	* ```
	*/
	reset() {
		this._data = new WordArray();
		this._nDataBytes = 0;
	}
	/**
	* Adds new data to this block algorithm's buffer.
	* 
	* @param data - The data to append (strings are converted to WordArray using UTF-8)
	* @example
	* ```javascript
	* bufferedBlockAlgorithm._append('data');
	* bufferedBlockAlgorithm._append(wordArray);
	* ```
	*/
	_append(data) {
		let m_data;
		if (typeof data === "string") m_data = Utf8.parse(data);
		else m_data = data;
		this._data.concat(m_data);
		this._nDataBytes += m_data.sigBytes;
	}
	/**
	* Processes available data blocks.
	* This method invokes _doProcessBlock(dataWords, offset), which must be implemented by a concrete subtype.
	* 
	* @param doFlush - Whether all blocks and partial blocks should be processed
	* @returns The processed data
	* @example
	* ```javascript
	* const processedData = bufferedBlockAlgorithm._process();
	* const processedData = bufferedBlockAlgorithm._process(true); // Flush
	* ```
	*/
	_process(doFlush) {
		let processedWords;
		const data = this._data;
		const dataWords = data.words;
		const dataSigBytes = data.sigBytes;
		const blockSizeBytes = this.blockSize * 4;
		let nBlocksReady = dataSigBytes / blockSizeBytes;
		if (doFlush) nBlocksReady = Math.ceil(nBlocksReady);
		else nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
		const nWordsReady = nBlocksReady * this.blockSize;
		const nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
		if (nWordsReady) {
			for (let offset = 0; offset < nWordsReady; offset += this.blockSize) this._doProcessBlock(dataWords, offset);
			processedWords = dataWords.splice(0, nWordsReady);
			data.sigBytes -= nBytesReady;
		}
		return new WordArray(processedWords || [], nBytesReady);
	}
	/**
	* Creates a copy of this object.
	* 
	* @returns The clone
	* @example
	* ```javascript
	* const clone = bufferedBlockAlgorithm.clone();
	* ```
	*/
	clone() {
		const clone = super.clone();
		clone._data = this._data.clone();
		return clone;
	}
};
/**
* Abstract hasher template.
* Base class for all hash algorithm implementations.
* 
* @property blockSize - The number of 32-bit words this hasher operates on (default: 16 = 512 bits)
*/
var Hasher = class extends BufferedBlockAlgorithm {
	/** The number of 32-bit words this hasher operates on */
	blockSize = 512 / 32;
	/** Configuration options */
	cfg;
	/** The hash result */
	_hash;
	/**
	* Initializes a newly created hasher.
	* 
	* @param cfg - Configuration options
	*/
	constructor(cfg) {
		super();
		this.cfg = Object.assign({}, cfg);
		this.reset();
	}
	/**
	* Creates a shortcut function to a hasher's object interface.
	* 
	* @param SubHasher - The hasher class to create a helper for
	* @returns The shortcut function
	* @static
	* @example
	* ```javascript
	* const SHA256 = Hasher._createHelper(SHA256Algo);
	* ```
	*/
	static _createHelper(SubHasher) {
		return (message, cfg) => {
			return new SubHasher(cfg).finalize(message);
		};
	}
	/**
	* Creates a shortcut function to the HMAC's object interface.
	* 
	* @param SubHasher - The hasher class to use in this HMAC helper
	* @returns The shortcut function
	* @static
	* @example
	* ```javascript
	* const HmacSHA256 = Hasher._createHmacHelper(SHA256Algo);
	* ```
	*/
	static _createHmacHelper(SubHasher) {
		return (message, key) => {
			return new HMAC(SubHasher, key).finalize(message);
		};
	}
	/**
	* Resets this hasher to its initial state.
	* 
	* @example
	* ```javascript
	* hasher.reset();
	* ```
	*/
	reset() {
		super.reset();
		this._doReset();
	}
	/**
	* Updates this hasher with a message.
	* 
	* @param messageUpdate - The message to append
	* @returns This hasher instance for method chaining
	* @example
	* ```javascript
	* hasher.update('message');
	* hasher.update(wordArray);
	* ```
	*/
	update(messageUpdate) {
		this._append(messageUpdate);
		this._process();
		return this;
	}
	/**
	* Finalizes the hash computation.
	* Note that the finalize operation is effectively a destructive, read-once operation.
	* 
	* @param messageUpdate - An optional final message update
	* @returns The computed hash
	* @example
	* ```javascript
	* const hash = hasher.finalize();
	* const hash = hasher.finalize('message');
	* const hash = hasher.finalize(wordArray);
	* ```
	*/
	finalize(messageUpdate) {
		if (messageUpdate) this._append(messageUpdate);
		const hash = this._doFinalize();
		return hash;
	}
};
/**
* Base class for 32-bit hash algorithms.
* Hash algorithms that operate on 32-bit words should extend this class.
*/
var Hasher32 = class extends Hasher {};
/**
* Base class for 64-bit hash algorithms.
* Hash algorithms that operate on 64-bit words should extend this class.
*/
var Hasher64 = class extends Hasher {};
/**
* HMAC (Hash-based Message Authentication Code) algorithm.
* Provides message authentication using a cryptographic hash function and a secret key.
*/
var HMAC = class HMAC extends Base {
	/** The inner hasher instance */
	_hasher;
	/** The outer key */
	_oKey;
	/** The inner key */
	_iKey;
	/**
	* Initializes a newly created HMAC.
	* 
	* @param SubHasher - The hash algorithm class to use
	* @param key - The secret key
	* @example
	* ```javascript
	* const hmac = new HMAC(SHA256Algo, 'secret key');
	* ```
	*/
	constructor(SubHasher, key) {
		super();
		const hasher = new SubHasher();
		this._hasher = hasher;
		let _key;
		if (typeof key === "string") _key = Utf8.parse(key);
		else _key = key;
		const hasherBlockSize = hasher.blockSize;
		const hasherBlockSizeBytes = hasherBlockSize * 4;
		if (_key.sigBytes > hasherBlockSizeBytes) _key = hasher.finalize(_key);
		_key.clamp();
		const oKey = _key.clone();
		this._oKey = oKey;
		const iKey = _key.clone();
		this._iKey = iKey;
		const oKeyWords = oKey.words;
		const iKeyWords = iKey.words;
		for (let i = 0; i < hasherBlockSize; i += 1) {
			oKeyWords[i] ^= 1549556828;
			iKeyWords[i] ^= 909522486;
		}
		oKey.sigBytes = hasherBlockSizeBytes;
		iKey.sigBytes = hasherBlockSizeBytes;
		this.reset();
	}
	static create(...args) {
		const [SubHasher, key] = args;
		return new HMAC(SubHasher, key);
	}
	/**
	* Resets this HMAC to its initial state.
	* 
	* @example
	* ```javascript
	* hmac.reset();
	* ```
	*/
	reset() {
		const hasher = this._hasher;
		hasher.reset();
		hasher.update(this._iKey);
	}
	/**
	* Updates this HMAC with a message.
	* 
	* @param messageUpdate - The message to append
	* @returns This HMAC instance for method chaining
	* @example
	* ```javascript
	* hmac.update('message');
	* hmac.update(wordArray);
	* ```
	*/
	update(messageUpdate) {
		this._hasher.update(messageUpdate);
		return this;
	}
	/**
	* Finalizes the HMAC computation.
	* Note that the finalize operation is effectively a destructive, read-once operation.
	* 
	* @param messageUpdate - An optional final message update
	* @returns The computed HMAC
	* @example
	* ```javascript
	* const hmacValue = hmac.finalize();
	* const hmacValue = hmac.finalize('message');
	* const hmacValue = hmac.finalize(wordArray);
	* ```
	*/
	finalize(messageUpdate) {
		const hasher = this._hasher;
		const innerHash = hasher.finalize(messageUpdate);
		hasher.reset();
		const hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
		return hmac;
	}
};

//#endregion
export { Base, BufferedBlockAlgorithm, HMAC, Hasher, Hasher32, Hasher64, Hex, Latin1, Utf8, WordArray };
//# sourceMappingURL=core.mjs.map