"use server";

import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/get-sessions";

export async function updateProfileName(name: string) {
  const session = await getServerSession();
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  if (!name.trim()) {
    return { success: false, error: "Name is required" };
  }

  try {
    // Use better-auth's updateUser so the cached session cookie is refreshed
    // alongside the DB row — a raw prisma update leaves the cookieCache stale.
    await auth.api.updateUser({
      body: { name: name.trim() },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update name";
    return { success: false, error: message };
  }
}

export async function updateProfileImage(imageUrl: string | null) {
  const session = await getServerSession();
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // Same as name — go through better-auth so the session cookie stays in sync.
    await auth.api.updateUser({
      body: { image: imageUrl },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update image";
    return { success: false, error: message };
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await getServerSession();
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters" };
  }

  try {
    // Get the account record with the hashed password
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "credential",
      },
    });

    if (!account?.password) {
      return { success: false, error: "No password set for this account" };
    }

    // Verify current password using better-auth's password utility
    const { verifyPassword, hashPassword } = await import("better-auth/crypto");

    const isValid = await verifyPassword({
      password: currentPassword,
      hash: account.password,
    });

    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Hash and update new password
    const hashedPassword = await hashPassword(newPassword);

    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to change password";
    return { success: false, error: message };
  }
}
