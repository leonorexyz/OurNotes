import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Berhasil keluar dari akun",
  });

  response.cookies.delete("our_notes_user_id");
  response.cookies.delete("auth_session");

  return response;
}

export async function GET(request: NextRequest) {
  return POST(request);
}
