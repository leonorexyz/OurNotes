import { NextRequest } from "next/server";
import { POST as handleForgotPassword } from "../forgot-password/route";

export async function POST(request: NextRequest) {
  return handleForgotPassword(request);
}
