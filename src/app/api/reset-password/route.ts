import { NextRequest } from "next/server";
import { POST as handleResetPassword } from "../auth/reset-password/route";

export async function POST(request: NextRequest) {
  return handleResetPassword(request);
}
