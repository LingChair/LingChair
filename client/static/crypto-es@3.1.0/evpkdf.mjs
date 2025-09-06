import { Base, WordArray } from "./core.mjs";
import { MD5Algo } from "./md5.mjs";

//#region src/evpkdf.ts
/**
* This key derivation function is meant to conform with EVP_BytesToKey.
* www.openssl.org/docs/crypto/EVP_BytesToKey.html
*/
var EvpKDFAlgo = class extends Base {
	cfg;
	/**
	* Initializes a newly created key derivation function.
	*
	* @param {Object} cfg (Optional) The configuration options to use for the derivation.
	*
	* @example
	*
	*     const kdf = new EvpKDFAlgo();
	*     const kdf = new EvpKDFAlgo({ keySize: 8 });
	*     const kdf = new EvpKDFAlgo({ keySize: 8, iterations: 1000 });
	*/
	constructor(cfg) {
		super();
		/**
		* Configuration options.
		*
		* @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
		* @property {Hasher} hasher The hash algorithm to use. Default: MD5
		* @property {number} iterations The number of iterations to perform. Default: 1
		*/
		this.cfg = Object.assign({}, {
			keySize: 128 / 32,
			hasher: MD5Algo,
			iterations: 1
		}, cfg);
	}
	/**
	* Derives a key from a password.
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
		let block;
		const { cfg } = this;
		const hasher = new cfg.hasher();
		const derivedKey = WordArray.create();
		const derivedKeyWords = derivedKey.words;
		const { keySize, iterations } = cfg;
		while (derivedKeyWords.length < keySize) {
			if (block) hasher.update(block);
			block = hasher.update(password).finalize(salt);
			hasher.reset();
			for (let i = 1; i < iterations; i += 1) {
				block = hasher.finalize(block);
				hasher.reset();
			}
			derivedKey.concat(block);
		}
		derivedKey.sigBytes = keySize * 4;
		return derivedKey;
	}
};
/**
* Derives a key from a password.
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
*     var key = EvpKDF(password, salt);
*     var key = EvpKDF(password, salt, { keySize: 8 });
*     var key = EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
*/
const EvpKDF = (password, salt, cfg) => new EvpKDFAlgo(cfg).compute(password, salt);

//#endregion
export { EvpKDF, EvpKDFAlgo };
//# sourceMappingURL=evpkdf.mjs.map