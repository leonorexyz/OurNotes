import { NextRequest } from "next/server";
import { GET as handleGetFavorite, DELETE as handleDeleteFavorite } from "../../favorites/[id]/route";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleGetFavorite(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleDeleteFavorite(request, context);
}
