import { WordArray } from "./core.mjs";

//#region src/enc-utf16.ts
/**
* Swaps endian of a word
* @param word - The word to swap
* @returns The word with swapped endian
*/
const swapEndian = (word) => word << 8 & 4278255360 | word >>> 8 & 16711935;
/**
* UTF-16 BE encoding strategy.
*/
const Utf16BE = {
	stringify(wordArray) {
		const { words, sigBytes } = wordArray;
		const utf16Chars = [];
		for (let i = 0; i < sigBytes; i += 2) {
			const codePoint = words[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
			utf16Chars.push(String.fromCharCode(codePoint));
		}
		return utf16Chars.join("");
	},
	parse(utf16Str) {
		const utf16StrLength = utf16Str.length;
		const words = [];
		for (let i = 0; i < utf16StrLength; i += 1) words[i >>> 1] |= utf16Str.charCodeAt(i) << 16 - i % 2 * 16;
		return WordArray.create(words, utf16StrLength * 2);
	}
};
/**
* UTF-16 encoding strategy (defaults to UTF-16 BE).
*/
const Utf16 = Utf16BE;
/**
* UTF-16 LE encoding strategy.
*/
const Utf16LE = {
	stringify(wordArray) {
		const { words, sigBytes } = wordArray;
		const utf16Chars = [];
		for (let i = 0; i < sigBytes; i += 2) {
			const codePoint = swapEndian(words[i >>> 2] >>> 16 - i % 4 * 8 & 65535);
			utf16Chars.push(String.fromCharCode(codePoint));
		}
		return utf16Chars.join("");
	},
	parse(utf16Str) {
		const utf16StrLength = utf16Str.length;
		const words = [];
		for (let i = 0; i < utf16StrLength; i += 1) words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << 16 - i % 2 * 16);
		return WordArray.create(words, utf16StrLength * 2);
	}
};

//#endregion
export { Utf16, Utf16BE, Utf16LE };
//# sourceMappingURL=enc-utf16.mjs.map