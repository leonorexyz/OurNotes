import { NextRequest } from "next/server";
import { GET as handleGetFavorites, POST as handlePostFavorite } from "../favorites/route";

export async function GET(request: NextRequest) {
  return handleGetFavorites(request);
}

export async function POST(request: NextRequest) {
  return handlePostFavorite(request);
}
