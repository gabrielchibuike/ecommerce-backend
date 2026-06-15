import argon2 from "argon2";

/**
 * Argon2 Password Hashing Utility
 * Parameters:
 * - memoryCost: 65536 KB (64 MB)
 * - timeCost: 3 iterations
 * - parallelism: 4 threads
 */

const argon2Options: argon2.Options = {
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
  type: argon2.argon2id,
};

export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, argon2Options);
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    throw new Error("Error verifying password");
  }
}
