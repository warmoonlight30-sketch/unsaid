import "server-only";
import { connection } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "unsaid_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000;

function signature(value: string) {
  const secret = process.env.UNSAID_SESSION_SECRET;
  if (!secret) throw new Error("Session secret is missing.");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSession() {
  const expires = String(Date.now() + SESSION_DURATION);
  return `${expires}.${signature(expires)}`;
}

export async function hasArchiveAccess() {
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!token || !process.env.UNSAID_SESSION_SECRET) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expires, supplied] = parts;

  if (!/^\d+$/.test(expires) || !/^[a-f0-9]{64}$/.test(supplied)) {
    return false;
  }

  const expiry = Number(expires);

  if (!Number.isSafeInteger(expiry) || expiry <= Date.now()) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(supplied, "hex"),
    Buffer.from(signature(expires), "hex")
  );
}