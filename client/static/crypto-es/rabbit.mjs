import { StreamCipher } from "./cipher-core.mjs";

//#region src/rabbit.ts
const S = [];
const C_ = [];
const G = [];
function nextState() {
	const X = this._X;
	const C = this._C;
	for (let i = 0; i < 8; i += 1) C_[i] = C[i];
	C[0] = C[0] + 1295307597 + this._b | 0;
	C[1] = C[1] + 3545052371 + (C[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
	C[2] = C[2] + 886263092 + (C[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
	C[3] = C[3] + 1295307597 + (C[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
	C[4] = C[4] + 3545052371 + (C[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
	C[5] = C[5] + 886263092 + (C[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
	C[6] = C[6] + 1295307597 + (C[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
	C[7] = C[7] + 3545052371 + (C[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
	this._b = C[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
	for (let i = 0; i < 8; i += 1) {
		const gx = X[i] + C[i];
		const ga = gx & 65535;
		const gb = gx >>> 16;
		const gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
		const gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
		G[i] = gh ^ gl;
	}
	X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
	X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
	X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
	X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
	X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
	X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
	X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
	X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
}
/**
* Rabbit stream cipher algorithm
*/
var RabbitAlgo = class extends StreamCipher {
	_X;
	_C;
	_b;
	static ivSize = 64 / 32;
	constructor(xformMode, key, cfg) {
		super(xformMode, key, cfg);
		this.blockSize = 128 / 32;
	}
	_doReset() {
		const K = this._key.words;
		const { iv } = this.cfg;
		for (let i = 0; i < 4; i += 1) K[i] = (K[i] << 8 | K[i] >>> 24) & 16711935 | (K[i] << 24 | K[i] >>> 8) & 4278255360;
		this._X = [
			K[0],
			K[3] << 16 | K[2] >>> 16,
			K[1],
			K[0] << 16 | K[3] >>> 16,
			K[2],
			K[1] << 16 | K[0] >>> 16,
			K[3],
			K[2] << 16 | K[1] >>> 16
		];
		const X = this._X;
		this._C = [
			K[2] << 16 | K[2] >>> 16,
			K[0] & 4294901760 | K[1] & 65535,
			K[3] << 16 | K[3] >>> 16,
			K[1] & 4294901760 | K[2] & 65535,
			K[0] << 16 | K[0] >>> 16,
			K[2] & 4294901760 | K[3] & 65535,
			K[1] << 16 | K[1] >>> 16,
			K[3] & 4294901760 | K[0] & 65535
		];
		const C = this._C;
		this._b = 0;
		for (let i = 0; i < 4; i += 1) nextState.call(this);
		for (let i = 0; i < 8; i += 1) C[i] ^= X[i + 4 & 7];
		if (iv) {
			const IV = iv.words;
			const IV_0 = IV[0];
			const IV_1 = IV[1];
			const i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
			const i2 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
			const i1 = i0 >>> 16 | i2 & 4294901760;
			const i3 = i2 << 16 | i0 & 65535;
			C[0] ^= i0;
			C[1] ^= i1;
			C[2] ^= i2;
			C[3] ^= i3;
			C[4] ^= i0;
			C[5] ^= i1;
			C[6] ^= i2;
			C[7] ^= i3;
			for (let i = 0; i < 4; i += 1) nextState.call(this);
		}
	}
	_doProcessBlock(M, offset) {
		const _M = M;
		const X = this._X;
		nextState.call(this);
		S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
		S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
		S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
		S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
		for (let i = 0; i < 4; i += 1) {
			S[i] = (S[i] << 8 | S[i] >>> 24) & 16711935 | (S[i] << 24 | S[i] >>> 8) & 4278255360;
			_M[offset + i] ^= S[i];
		}
	}
};
/**
* Shortcut functions to the cipher's object interface.
*
* @example
*
*     var ciphertext = Rabbit.encrypt(message, key, cfg);
*     var plaintext  = Rabbit.decrypt(ciphertext, key, cfg);
*/
const Rabbit = StreamCipher._createHelper(RabbitAlgo);

//#endregion
export { Rabbit, RabbitAlgo };
//# sourceMappingURL=rabbit.mjs.map