import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string | null;
}

export async function getCurrentUser(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    // 1. Check x-user-id header
    let userId = request.headers.get("x-user-id");

    // 2. Check Authorization Bearer header
    if (!userId) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        userId = authHeader.substring(7).trim();
      }
    }

    // 3. Check cookies
    if (!userId) {
      userId =
        request.cookies.get("our_notes_user_id")?.value ||
        request.cookies.get("auth_session")?.value ||
        null;
    }

    // 4. Check search query (for dev testing)
    if (!userId) {
      userId =
        request.nextUrl.searchParams.get("userId") ||
        request.nextUrl.searchParams.get("authUserId") ||
        null;
    }

    if (!userId) {
      return null;
    }

    // Lookup user in DB
    const userRow = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (userRow) {
      return userRow;
    }

    // If userId starts with 'guest-' or 'demo-', auto-create or mock return
    if (userId.startsWith("guest-") || userId === "guest") {
      return {
        id: userId,
        name: "Produser Tamu",
        email: `${userId}@guest.ournotes.id`,
        avatarUrl: null,
        role: "guest",
      };
    }

    return null;
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Error retrieving authenticated user:", error);
    return null;
  }
}

export async function requireAuth(
  request: NextRequest
): Promise<
  | { user: AuthenticatedUser; errorResponse?: never }
  | { user?: never; errorResponse: NextResponse }
> {
  const user = await getCurrentUser(request);

  if (!user) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error:
            "Autentikasi diperlukan. Silakan masuk sebagai Produser terlebih dahulu untuk menyimpan formasi tim Anda.",
          authRequired: true,
        },
        { status: 401 }
      ),
    };
  }

  return { user };
}
