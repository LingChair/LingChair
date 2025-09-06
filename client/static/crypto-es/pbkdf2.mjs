import { Base, HMAC, WordArray } from "./core.mjs";
import { SHA256Algo } from "./sha256.mjs";

//#region src/pbkdf2.ts
/**
* Password-Based Key Derivation Function 2 algorithm.
*/
var PBKDF2Algo = class extends Base {
	cfg;
	/**
	* Initializes a newly created key derivation function.
	*
	* @param {Object} cfg (Optional) The configuration options to use for the derivation.
	*
	* @example
	*
	*     const kdf = new PBKDF2Algo();
	*     const kdf = new PBKDF2Algo({ keySize: 8 });
	*     const kdf = new PBKDF2Algo({ keySize: 8, iterations: 1000 });
	*/
	constructor(cfg) {
		super();
		/**
		* Configuration options.
		* 
		* The default `hasher` and `interations` is different from CryptoJs to enhance security:
		* https://github.com/entronad/crypto-es/security/advisories/GHSA-mpj8-q39x-wq5h
		*
		* @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
		* @property {Hasher} hasher The hasher to use. Default: SHA256
		* @property {number} iterations The number of iterations to perform. Default: 250000
		*/
		this.cfg = Object.assign({}, {
			keySize: 128 / 32,
			hasher: SHA256Algo,
			iterations: 25e4
		}, cfg);
	}
	/**
	* Computes the Password-Based Key Derivation Function 2.
	*
	* @param {WordArray|string} password The password.
	* @param {WordArray|string} salt A salt.
	*
	* @return {WordArray} The derived key.
	*
	* @example
	*
	*     const key = kdf.compute(password, salt);
	*/
	compute(password, salt) {
		const { cfg } = this;
		const hmac = HMAC.create(cfg.hasher, password);
		const derivedKey = WordArray.create();
		const blockIndex = WordArray.create([1]);
		const derivedKeyWords = derivedKey.words;
		const blockIndexWords = blockIndex.words;
		const { keySize, iterations } = cfg;
		while (derivedKeyWords.length < keySize) {
			const block = hmac.update(salt).finalize(blockIndex);
			hmac.reset();
			const blockWords = block.words;
			const blockWordsLength = blockWords.length;
			let intermediate = block;
			for (let i = 1; i < iterations; i += 1) {
				intermediate = hmac.finalize(intermediate);
				hmac.reset();
				const intermediateWords = intermediate.words;
				for (let j = 0; j < blockWordsLength; j += 1) blockWords[j] ^= intermediateWords[j];
			}
			derivedKey.concat(block);
			blockIndexWords[0] += 1;
		}
		derivedKey.sigBytes = keySize * 4;
		return derivedKey;
	}
};
/**
* Computes the Password-Based Key Derivation Function 2.
*
* @param {WordArray|string} password The password.
* @param {WordArray|string} salt A salt.
* @param {Object} cfg (Optional) The configuration options to use for this computation.
*
* @return {WordArray} The derived key.
*
* @static
*
* @example
*
*     var key = PBKDF2(password, salt);
*     var key = PBKDF2(password, salt, { keySize: 8 });
*     var key = PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
*/
const PBKDF2 = (password, salt, cfg) => new PBKDF2Algo(cfg).compute(password, salt);

//#endregion
export { PBKDF2, PBKDF2Algo };
//# sourceMappingURL=pbkdf2.mjs.map