import { BlockCipher } from "./cipher-core.mjs";

//#region src/aes.ts
const _SBOX = [];
const INV_SBOX = [];
const _SUB_MIX_0 = [];
const _SUB_MIX_1 = [];
const _SUB_MIX_2 = [];
const _SUB_MIX_3 = [];
const INV_SUB_MIX_0 = [];
const INV_SUB_MIX_1 = [];
const INV_SUB_MIX_2 = [];
const INV_SUB_MIX_3 = [];
const RCON = [
	0,
	1,
	2,
	4,
	8,
	16,
	32,
	64,
	128,
	27,
	54
];
/**
* AES block cipher algorithm.
*/
var AESAlgo = class extends BlockCipher {
	/** Number of rounds for this key size */
	_nRounds;
	/** Previous key for optimization */
	_keyPriorReset;
	/** Key schedule for encryption */
	_keySchedule;
	/** Inverse key schedule for decryption */
	_invKeySchedule;
	/** Key size in 32-bit words */
	static keySize = 256 / 32;
	_doReset() {
		let t;
		if (this._nRounds && this._keyPriorReset === this._key) return;
		this._keyPriorReset = this._key;
		const key = this._keyPriorReset;
		const keyWords = key.words;
		const keySize = key.sigBytes / 4;
		this._nRounds = keySize + 6;
		const nRounds = this._nRounds;
		const ksRows = (nRounds + 1) * 4;
		this._keySchedule = [];
		const keySchedule = this._keySchedule;
		for (let ksRow = 0; ksRow < ksRows; ksRow += 1) if (ksRow < keySize) keySchedule[ksRow] = keyWords[ksRow];
		else {
			t = keySchedule[ksRow - 1];
			if (!(ksRow % keySize)) {
				t = t << 8 | t >>> 24;
				t = _SBOX[t >>> 24] << 24 | _SBOX[t >>> 16 & 255] << 16 | _SBOX[t >>> 8 & 255] << 8 | _SBOX[t & 255];
				t ^= RCON[ksRow / keySize | 0] << 24;
			} else if (keySize > 6 && ksRow % keySize === 4) t = _SBOX[t >>> 24] << 24 | _SBOX[t >>> 16 & 255] << 16 | _SBOX[t >>> 8 & 255] << 8 | _SBOX[t & 255];
			keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
		}
		this._invKeySchedule = [];
		const invKeySchedule = this._invKeySchedule;
		for (let invKsRow = 0; invKsRow < ksRows; invKsRow += 1) {
			const ksRow = ksRows - invKsRow;
			if (invKsRow % 4) t = keySchedule[ksRow];
			else t = keySchedule[ksRow - 4];
			if (invKsRow < 4 || ksRow <= 4) invKeySchedule[invKsRow] = t;
			else invKeySchedule[invKsRow] = INV_SUB_MIX_0[_SBOX[t >>> 24]] ^ INV_SUB_MIX_1[_SBOX[t >>> 16 & 255]] ^ INV_SUB_MIX_2[_SBOX[t >>> 8 & 255]] ^ INV_SUB_MIX_3[_SBOX[t & 255]];
		}
	}
	encryptBlock(M, offset) {
		this._doCryptBlock(M, offset, this._keySchedule, _SUB_MIX_0, _SUB_MIX_1, _SUB_MIX_2, _SUB_MIX_3, _SBOX);
	}
	decryptBlock(M, offset) {
		const _M = M;
		let t = _M[offset + 1];
		_M[offset + 1] = _M[offset + 3];
		_M[offset + 3] = t;
		this._doCryptBlock(_M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
		t = _M[offset + 1];
		_M[offset + 1] = _M[offset + 3];
		_M[offset + 3] = t;
	}
	_doCryptBlock(M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
		const _M = M;
		const nRounds = this._nRounds;
		let s0 = _M[offset] ^ keySchedule[0];
		let s1 = _M[offset + 1] ^ keySchedule[1];
		let s2 = _M[offset + 2] ^ keySchedule[2];
		let s3 = _M[offset + 3] ^ keySchedule[3];
		let ksRow = 4;
		for (let round = 1; round < nRounds; round += 1) {
			const t0$1 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[s1 >>> 16 & 255] ^ SUB_MIX_2[s2 >>> 8 & 255] ^ SUB_MIX_3[s3 & 255] ^ keySchedule[ksRow];
			ksRow += 1;
			const t1$1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[s2 >>> 16 & 255] ^ SUB_MIX_2[s3 >>> 8 & 255] ^ SUB_MIX_3[s0 & 255] ^ keySchedule[ksRow];
			ksRow += 1;
			const t2$1 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[s3 >>> 16 & 255] ^ SUB_MIX_2[s0 >>> 8 & 255] ^ SUB_MIX_3[s1 & 255] ^ keySchedule[ksRow];
			ksRow += 1;
			const t3$1 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[s0 >>> 16 & 255] ^ SUB_MIX_2[s1 >>> 8 & 255] ^ SUB_MIX_3[s2 & 255] ^ keySchedule[ksRow];
			ksRow += 1;
			s0 = t0$1;
			s1 = t1$1;
			s2 = t2$1;
			s3 = t3$1;
		}
		const t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 255] << 16 | SBOX[s2 >>> 8 & 255] << 8 | SBOX[s3 & 255]) ^ keySchedule[ksRow];
		ksRow += 1;
		const t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 255] << 16 | SBOX[s3 >>> 8 & 255] << 8 | SBOX[s0 & 255]) ^ keySchedule[ksRow];
		ksRow += 1;
		const t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 255] << 16 | SBOX[s0 >>> 8 & 255] << 8 | SBOX[s1 & 255]) ^ keySchedule[ksRow];
		ksRow += 1;
		const t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 255] << 16 | SBOX[s1 >>> 8 & 255] << 8 | SBOX[s2 & 255]) ^ keySchedule[ksRow];
		ksRow += 1;
		_M[offset] = t0;
		_M[offset + 1] = t1;
		_M[offset + 2] = t2;
		_M[offset + 3] = t3;
	}
};
/**
* Shortcut functions to the cipher's object interface.
*
* @example
*
*     var ciphertext = AES.encrypt(message, key, cfg);
*     var plaintext  = AES.decrypt(ciphertext, key, cfg);
*/
const AES = BlockCipher._createHelper(AESAlgo);

//#endregion
export { AES, AESAlgo };
//# sourceMappingURL=aes.mjs.map