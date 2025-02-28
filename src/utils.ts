import {Buffer} from "buffer";


/**
 *
 * Return the Initial Origin Private Key
 */
export const originPrivateKey =
    "01019280BDB84B8F8AEDBA205FE3552689964A5626EE2C60AA10E3BF22A91A036009";


/**
 * Convert CryptoJS.lib.WordArray to Uint8Array
 */
export function wordArrayToUint8Array(wordArray: any) : Uint8Array {
    const dataArray = new Uint8Array(wordArray.sigBytes);
    for (let i = 0x0; i < wordArray.sigBytes; i++) {
        dataArray[i] = wordArray.words[i >>> 0x2] >>> 0x18 - i % 0x4 * 0x8 & 0xff;
    }
    return new Uint8Array(dataArray);
}

/**
 * Check if a string is a valid hex string
 * @param str
 */
export function isHex(str: string) {
    return /^[0-9a-fA-F]+$/.test(str)
}

/**
 * Convert a hex string to a Uint8Array
 * @param str
 */
export function hexToUint8Array(str: string) : Uint8Array {
    if (!isHex(str)) {
        throw new Error("Invalid hex string")
    }
    return new Uint8Array(str.match(/.{1,2}/g)!.map(byte => parseInt(byte, 0x10)));
}

export function maybeStringToUint8Array(str: string | Uint8Array) : Uint8Array {
    if (typeof str === "string") {
        if (isHex(str)) {
            str = hexToUint8Array(str)
        }else{
            str = new TextEncoder().encode(str)
        }

    }
    return str
}

export function maybeHexToUint8Array(str: string | Uint8Array) : Uint8Array {
    if (typeof str === "string") {
        if (isHex(str)) {
            str = hexToUint8Array(str)
        }else{
            throw new Error("Invalid hex string")
        }

    }
    return str
}

export function maybeUint8ArrayToHex(bytes: Uint8Array | string) : string {
    if (bytes instanceof Uint8Array) {
        return uint8ArrayToHex(bytes)
    }
    return bytes
}

/**
 * Encode an integer into a Uint8Array (4 bytes)
 * @param int Integer to encode
 * @returns {Uint8Array} Encoded integer
 */
export function intToUint8Array(int: number) : Uint8Array {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0x0, int, true);
    return new Uint8Array(buffer).reverse();
}

/**
 * Encode a big integer into a Uint8Array (8 bytes)
 * @param {Number} number Number to encode
 */
export function bigIntToUint8Array(number: number) : Uint8Array {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigUint64(0x0, BigInt(number), true);
    return new Uint8Array(buffer).reverse();
}

/**
 * Decode byte array (4 bytes) into a integer
 * @param {Uint8Array} bytes Bytes array to decode
 */
export function uint8ArrayToInt(bytes: Uint8Array) : number {
    let value = 0;
    for (let i = 0; i < bytes.length; i++) {
        value = (value * 256) + bytes[i];
    }
    return value;
}

/**
 * Convert any number into a big int for 10^8 decimals
 * @param number Number to convert
 * @param decimal Number of decimals
 */
export function toBigInt(number: number, decimal: number = 8) : number {
    return Math.trunc(number * Math.pow(10, decimal));
}

/**
 * Convert a big int number of 10^8 decimals into a decimal number
 * @param number Number to convert
 * @param decimal Number of decimals
 */
export function fromBigInt(number: number, decimal: number = 8) : number {
    return number / Math.pow(10, decimal);
}

/**
 * Concatenate multiple Uint8Array into one
 * @param {Uint8Array[]} arrays
 */
export function concatUint8Arrays(...arrays: Uint8Array[]) : Uint8Array {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new Uint8Array(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

/**
 * Encode an Uint8Array into an hexadecimal string
 * @param {Uint8Array} bytes Uint8Array
 */
export function uint8ArrayToHex(bytes: Uint8Array) : string {
    return Buffer.from(bytes).toString("hex");
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/**
 * Encode an Uint8Array into a base64url string
 * @param arraybuffer
 */
export function base64url(arraybuffer: ArrayBuffer): string {
    let bytes = new Uint8Array(arraybuffer),
        i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
        base64 = base64.substring(0, base64.length - 1);
    } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2);
    }

    return base64;
}

/**
 * Convert any number into a byte array
 */
export function toByteArray(number: number) : Uint8Array {
    if (!number) return Uint8Array.from([0]);
    const a = [];
    a.unshift(number & 255);
    while (number >= 256) {
        number = number >>> 8;
        a.unshift(number & 255);
    }
    return Uint8Array.from(a);
}
