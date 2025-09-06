import { parseLoop } from "./enc-base64.mjs";

//#region src/enc-base64url.ts
/**
* Base64url encoding strategy implementation.
* @private
*/
var Base64urlImpl = class {
	/** Standard Base64 character map */
	_map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	/** URL-safe Base64 character map (no padding) */
	_safeMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	/** Reverse character map for decoding */
	_reverseMap;
	/**
	* Converts a word array to a Base64url string.
	* 
	* @param wordArray - The word array to convert
	* @param urlSafe - Whether to use URL-safe encoding (default: true)
	* @returns The Base64url string representation
	* @example
	* ```javascript
	* // URL-safe encoding (default)
	* const base64urlString = Base64url.stringify(wordArray);
	* 
	* // Standard Base64 encoding
	* const base64String = Base64url.stringify(wordArray, false);
	* ```
	*/
	stringify(wordArray, urlSafe = true) {
		const { words, sigBytes } = wordArray;
		const map = urlSafe ? this._safeMap : this._map;
		wordArray.clamp();
		const base64Chars = [];
		for (let i = 0; i < sigBytes; i += 3) {
			const byte1 = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
			const byte2 = words[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255;
			const byte3 = words[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255;
			const triplet = byte1 << 16 | byte2 << 8 | byte3;
			for (let j = 0; j < 4 && i + j * .75 < sigBytes; j += 1) base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
		}
		const paddingChar = map.charAt(64);
		if (paddingChar) while (base64Chars.length % 4) base64Chars.push(paddingChar);
		return base64Chars.join("");
	}
	/**
	* Converts a Base64url string to a word array.
	* 
	* @param base64Str - The Base64url string to parse
	* @param urlSafe - Whether to use URL-safe decoding (default: true)
	* @returns The word array representation
	* @example
	* ```javascript
	* // URL-safe decoding (default)
	* const wordArray = Base64url.parse(base64urlString);
	* 
	* // Standard Base64 decoding
	* const wordArray = Base64url.parse(base64String, false);
	* ```
	*/
	parse(base64Str, urlSafe = true) {
		let base64StrLength = base64Str.length;
		const map = urlSafe ? this._safeMap : this._map;
		let reverseMap = this._reverseMap;
		if (!reverseMap) {
			this._reverseMap = [];
			reverseMap = this._reverseMap;
			for (let j = 0; j < map.length; j += 1) reverseMap[map.charCodeAt(j)] = j;
		}
		const paddingChar = map.charAt(64);
		if (paddingChar) {
			const paddingIndex = base64Str.indexOf(paddingChar);
			if (paddingIndex !== -1) base64StrLength = paddingIndex;
		}
		return parseLoop(base64Str, base64StrLength, reverseMap);
	}
};
/**
* Base64url encoding strategy.
* Provides URL-safe Base64 encoding/decoding that can be used in URLs without escaping.
* 
* The URL-safe variant:
* - Uses '-' instead of '+'
* - Uses '_' instead of '/'
* - Omits padding '=' characters
* 
* @example
* ```javascript
* // URL-safe encoding (default)
* const urlSafeString = Base64url.stringify(wordArray);
* const wordArray = Base64url.parse(urlSafeString);
* 
* // Standard Base64 encoding
* const base64String = Base64url.stringify(wordArray, false);
* const wordArray = Base64url.parse(base64String, false);
* ```
*/
const Base64url = new Base64urlImpl();

//#endregion
export { Base64url };
//# sourceMappingURL=enc-base64url.mjs.map