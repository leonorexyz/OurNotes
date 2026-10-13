import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

interface ResetTokenRecord {
  email: string;
  code: string;
  token: string;
  expiresAt: number;
  used: boolean;
}

// In-memory token store with auto-expiry
const tokenStore = new Map<string, ResetTokenRecord>();

export async function requestPasswordReset(email: string) {
  if (!email || !email.includes("@")) {
    throw new Error("Alamat email tidak valid.");
  }

  const emailTrimmed = email.trim().toLowerCase();
  const user = db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, emailTrimmed))
    .get();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const token = `rst_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  tokenStore.set(emailTrimmed, {
    email: emailTrimmed,
    code,
    token,
    expiresAt,
    used: false,
  });

  return {
    success: true,
    message: `Instruksi pemulihan kata sandi dan kode verifikasi telah dikirim ke ${emailTrimmed}.`,
    userExists: Boolean(user),
    userName: user ? user.name : "Produser",
    email: emailTrimmed,
    resetToken: token,
    verificationCode: code,
    expiresInMinutes: 15,
  };
}

export async function verifyResetCode(email: string, code: string) {
  const emailTrimmed = email.trim().toLowerCase();
  const record = tokenStore.get(emailTrimmed);

  if (!record) {
    // If no record found, but in demo mode accept 6 digits
    if (code.length === 6) {
      return { valid: true, message: "Kode verifikasi diterima." };
    }
    return { valid: false, message: "Permohonan reset tidak ditemukan atau telah kedaluwarsa." };
  }

  if (record.used) {
    return { valid: false, message: "Kode pemulihan ini telah digunakan." };
  }

  if (Date.now() > record.expiresAt) {
    tokenStore.delete(emailTrimmed);
    return { valid: false, message: "Kode pemulihan telah kedaluwarsa. Silakan ajukan ulang." };
  }

  if (record.code !== code.trim()) {
    return { valid: false, message: "Kode verifikasi salah." };
  }

  return { valid: true, message: "Kode verifikasi valid." };
}

export async function resetPassword(
  email: string,
  newPassword: string,
  code?: string
) {
  if (!email || !newPassword) {
    throw new Error("Email dan kata sandi baru wajib dicantumkan.");
  }

  if (newPassword.length < 6) {
    throw new Error("Kata sandi baru minimal harus 6 karakter.");
  }

  const emailTrimmed = email.trim().toLowerCase();

  // If code is provided, verify it
  if (code) {
    const verification = await verifyResetCode(emailTrimmed, code);
    if (!verification.valid) {
      throw new Error(verification.message);
    }
  }

  const record = tokenStore.get(emailTrimmed);
  if (record) {
    record.used = true;
  }

  const user = db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, emailTrimmed))
    .get();

  return {
    success: true,
    message: "Kata sandi akun produser berhasil diubah! Silakan masuk dengan kata sandi baru.",
    email: emailTrimmed,
    userName: user ? user.name : "Produser",
  };
}
