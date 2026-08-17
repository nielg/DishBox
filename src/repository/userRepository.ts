import sql from "@/lib/db";
import type { dbResponse } from "@/types";
import type { UserLoginResponse } from "@/types/user";

const dbLogin = async (
  username: string,
  password: string,
): Promise<dbResponse<UserLoginResponse | null>> => {
  try {
    const rows = await sql<UserLoginResponse[]>`
      SELECT id, username
      FROM "user"
      WHERE username = ${username} AND password = ${password}
      LIMIT 1
    `;

    const user = rows[0] ?? null;

    return {
      success: !!user,
      result: user,
    };
  } catch (error) {
    console.error(`DB: Query failed for user ${username}:`, error);
    throw new Error("Database fetch failed");
  }
};

const userRepository = {
  dbLogin,
};

export default userRepository;
