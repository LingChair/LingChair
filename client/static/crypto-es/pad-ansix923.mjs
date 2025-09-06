//#region src/pad-ansix923.ts
/**
* ANSI X.923 padding strategy.
*/
const AnsiX923 = {
	pad(data, blockSize) {
		const _data = data;
		const dataSigBytes = _data.sigBytes;
		const blockSizeBytes = blockSize * 4;
		const nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
		const lastBytePos = dataSigBytes + nPaddingBytes - 1;
		_data.clamp();
		_data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
		_data.sigBytes += nPaddingBytes;
	},
	unpad(data) {
		const _data = data;
		const nPaddingBytes = _data.words[_data.sigBytes - 1 >>> 2] & 255;
		_data.sigBytes -= nPaddingBytes;
	}
};

//#endregion
export { AnsiX923 };
//# sourceMappingURL=pad-ansix923.mjs.map