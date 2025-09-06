//#region src/pad-zeropadding.ts
/**
* Zero padding strategy.
*/
const ZeroPadding = {
	pad(data, blockSize) {
		const _data = data;
		const blockSizeBytes = blockSize * 4;
		_data.clamp();
		_data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
	},
	unpad(data) {
		const _data = data;
		const dataWords = _data.words;
		for (let i = _data.sigBytes - 1; i >= 0; i -= 1) if (dataWords[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
			_data.sigBytes = i + 1;
			break;
		}
	}
};

//#endregion
export { ZeroPadding };
//# sourceMappingURL=pad-zeropadding.mjs.map