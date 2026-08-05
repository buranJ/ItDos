import "server-only";

import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEYLEN = 64;

/**
 * scrypt from Node's standard library — no native add-on, no supply-chain
 * surface, and memory-hard, which is what actually matters against offline
 * cracking. Stored as `<salt-hex>:<key-hex>`.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEYLEN);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, keyHex] = stored.split(":");
  if (!saltHex || !keyHex) return false;

  const expected = Buffer.from(keyHex, "hex");
  if (expected.length !== KEYLEN) return false;

  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), KEYLEN);
  // Constant-time: a plain === leaks how much of the hash matched.
  return timingSafeEqual(actual, expected);
}
