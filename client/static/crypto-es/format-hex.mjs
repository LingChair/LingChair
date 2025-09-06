import { Hex } from "./core.mjs";
import { CipherParams } from "./cipher-core.mjs";

//#region src/format-hex.ts
/**
* Hex formatter for cipher params.
* Converts cipher params to/from hexadecimal strings.
*/
const HexFormatter = {
	stringify(cipherParams) {
		if (!cipherParams.ciphertext) throw new Error("Ciphertext is required");
		return cipherParams.ciphertext.toString(Hex);
	},
	parse(input) {
		const ciphertext = Hex.parse(input);
		return CipherParams.create({ ciphertext });
	}
};

//#endregion
export { HexFormatter };
//# sourceMappingURL=format-hex.mjs.map