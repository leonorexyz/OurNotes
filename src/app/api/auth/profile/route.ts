import { NextRequest, NextResponse } from "next/server";
import { GET as handleGetMe, PATCH as handlePatchMe } from "../me/route";

export async function GET(request: NextRequest) {
  return handleGetMe(request);
}

export async function PATCH(request: NextRequest) {
  return handlePatchMe(request);
}

export async function POST(request: NextRequest) {
  return handlePatchMe(request);
}
