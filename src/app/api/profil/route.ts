import { NextRequest } from "next/server";
import { GET as handleGetProfile, PATCH as handlePatchProfile } from "../profile/route";

export async function GET(request: NextRequest) {
  return handleGetProfile(request);
}

export async function PATCH(request: NextRequest) {
  return handlePatchProfile(request);
}

export async function PUT(request: NextRequest) {
  return handlePatchProfile(request);
}

export async function POST(request: NextRequest) {
  return handlePatchProfile(request);
}
