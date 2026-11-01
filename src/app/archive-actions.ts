"use server";

import { scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, SESSION_COOKIE } from "@/lib/archive-auth";

export async function unlockArchive(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const password = formData.get("password");
  const salt = process.env.UNSAID_PASSWORD_SALT;
  const hash = process.env.UNSAID_PASSWORD_HASH;

  if (!salt || !hash || !process.env.UNSAID_SESSION_SECRET) {
    return { error: "The private key is not configured yet." };
  }

  if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 128
  ) {
    return { error: "That key does not fit. Please try again." };
  }

  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");

  if (
    actual.length !== expected.length ||
    !timingSafeEqual(actual, expected)
  ) {
    return { error: "That key does not fit. Please try again." };
  }

  (await cookies()).set(SESSION_COOKIE, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });

  return { success: true };
}

export async function lockArchive() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}