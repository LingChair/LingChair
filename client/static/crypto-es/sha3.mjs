import { Hasher, Hasher32, WordArray } from "./core.mjs";
import { X64Word } from "./x64-core.mjs";

//#region src/sha3.ts
const RHO_OFFSETS = [];
const PI_INDEXES = [];
const ROUND_CONSTANTS = [];
const T = /* @__PURE__ */ (() => {
	const a = [];
	for (let i = 0; i < 25; i += 1) a[i] = X64Word.create();
	return a;
})();
/**
* SHA-3 hash algorithm.
*/
var SHA3Algo = class extends Hasher32 {
	_state = [];
	/**
	* Initializes a newly created hasher.
	*
	* @param cfg - Configuration options.
	* @property {number} outputLength - The desired number of bits in the output hash.
	*   Only values permitted are: 224, 256, 384, 512.
	*   Default: 512
	*/
	constructor(cfg) {
		super(Object.assign({ outputLength: 512 }, cfg));
	}
	_doReset() {
		this._state = [];
		for (let i = 0; i < 25; i += 1) this._state[i] = new X64Word();
		this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
	}
	_doProcessBlock(M, offset) {
		if (this._state.length === 0) this._doReset();
		const state = this._state;
		const nBlockSizeLanes = this.blockSize / 2;
		for (let i = 0; i < nBlockSizeLanes; i += 1) {
			let M2i = M[offset + 2 * i];
			let M2i1 = M[offset + 2 * i + 1];
			M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
			M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
			const lane = state[i];
			lane.high ^= M2i1;
			lane.low ^= M2i;
		}
		for (let round = 0; round < 24; round += 1) {
			for (let x = 0; x < 5; x += 1) {
				let tMsw = 0;
				let tLsw = 0;
				for (let y = 0; y < 5; y += 1) {
					const lane$1 = state[x + 5 * y];
					tMsw ^= lane$1.high;
					tLsw ^= lane$1.low;
				}
				const Tx = T[x];
				Tx.high = tMsw;
				Tx.low = tLsw;
			}
			for (let x = 0; x < 5; x += 1) {
				const Tx4 = T[(x + 4) % 5];
				const Tx1 = T[(x + 1) % 5];
				const Tx1Msw = Tx1.high;
				const Tx1Lsw = Tx1.low;
				const tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
				const tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
				for (let y = 0; y < 5; y += 1) {
					const lane$1 = state[x + 5 * y];
					lane$1.high ^= tMsw;
					lane$1.low ^= tLsw;
				}
			}
			for (let laneIndex = 1; laneIndex < 25; laneIndex += 1) {
				let tMsw;
				let tLsw;
				const lane$1 = state[laneIndex];
				const laneMsw = lane$1.high;
				const laneLsw = lane$1.low;
				const rhoOffset = RHO_OFFSETS[laneIndex];
				if (rhoOffset < 32) {
					tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
					tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
				} else {
					tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
					tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
				}
				const TPiLane = T[PI_INDEXES[laneIndex]];
				TPiLane.high = tMsw;
				TPiLane.low = tLsw;
			}
			const T0 = T[0];
			const state0 = state[0];
			T0.high = state0.high;
			T0.low = state0.low;
			for (let x = 0; x < 5; x += 1) for (let y = 0; y < 5; y += 1) {
				const laneIndex = x + 5 * y;
				const lane$1 = state[laneIndex];
				const TLane = T[laneIndex];
				const Tx1Lane = T[(x + 1) % 5 + 5 * y];
				const Tx2Lane = T[(x + 2) % 5 + 5 * y];
				lane$1.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
				lane$1.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
			}
			const lane = state[0];
			const roundConstant = ROUND_CONSTANTS[round];
			lane.high ^= roundConstant.high;
			lane.low ^= roundConstant.low;
		}
	}
	_doFinalize() {
		const data = this._data;
		const dataWords = data.words;
		const nBitsLeft = data.sigBytes * 8;
		const blockSizeBits = this.blockSize * 32;
		dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
		dataWords[(Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
		data.sigBytes = dataWords.length * 4;
		this._process();
		const state = this._state;
		const outputLengthBytes = this.cfg.outputLength / 8;
		const outputLengthLanes = outputLengthBytes / 8;
		const hashWords = [];
		for (let i = 0; i < outputLengthLanes; i += 1) {
			const lane = state[i];
			let laneMsw = lane.high;
			let laneLsw = lane.low;
			laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
			laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
			hashWords.push(laneLsw);
			hashWords.push(laneMsw);
		}
		return new WordArray(hashWords, outputLengthBytes);
	}
	clone() {
		const clone = super.clone.call(this);
		clone._state = [];
		for (let i = 0; i < this._state.length; i += 1) clone._state[i] = this._state[i].clone();
		return clone;
	}
};
/**
* Shortcut function to the hasher's object interface.
*
* @param message - The message to hash.
* @returns The hash.
*
* @example
* ```js
* const hash = SHA3('message');
* const hash = SHA3(wordArray);
* ```
*/
const SHA3 = Hasher._createHelper(SHA3Algo);
/**
* Shortcut function to the HMAC's object interface.
*
* @param message - The message to hash.
* @param key - The secret key.
* @returns The HMAC.
*
* @example
* ```js
* const hmac = HmacSHA3(message, key);
* ```
*/
const HmacSHA3 = Hasher._createHmacHelper(SHA3Algo);

//#endregion
export { HmacSHA3, SHA3, SHA3Algo };
//# sourceMappingURL=sha3.mjs.map