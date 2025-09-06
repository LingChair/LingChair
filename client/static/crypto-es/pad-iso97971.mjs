import { WordArray } from "./core.mjs";
import { ZeroPadding } from "./pad-zeropadding.mjs";

//#region src/pad-iso97971.ts
/**
* ISO/IEC 9797-1 Padding Method 2.
*/
const Iso97971 = {
	pad(data, blockSize) {
		data.concat(WordArray.create([2147483648], 1));
		ZeroPadding.pad(data, blockSize);
	},
	unpad(data) {
		const _data = data;
		ZeroPadding.unpad(_data);
		_data.sigBytes -= 1;
	}
};

//#endregion
export { Iso97971 };
//# sourceMappingURL=pad-iso97971.mjs.map