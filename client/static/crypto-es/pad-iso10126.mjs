import { WordArray } from "./core.mjs";

//#region src/pad-iso10126.ts
/**
* ISO 10126 padding strategy.
*/
const Iso10126 = {
	pad(data, blockSize) {
		const blockSizeBytes = blockSize * 4;
		const nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
		data.concat(WordArray.random(nPaddingBytes - 1)).concat(WordArray.create([nPaddingBytes << 24], 1));
	},
	unpad(data) {
		const _data = data;
		const nPaddingBytes = _data.words[_data.sigBytes - 1 >>> 2] & 255;
		_data.sigBytes -= nPaddingBytes;
	}
};

//#endregion
export { Iso10126 };
//# sourceMappingURL=pad-iso10126.mjs.map