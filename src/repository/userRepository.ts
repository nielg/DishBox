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

const createUser = async ({
  userName,
  firstName,
  lastName,
  email,
  password,
}: {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ success: boolean }> => {
  try {
    await sql`
      INSERT INTO "user" (user_name, first_name, last_name, email, password)
      VALUES (${userName}, ${firstName}, ${lastName}, ${email}, ${password})
    `;

    return { success: true };
  } catch (error) {
    console.error(`DB: Failed to create user ${userName}`, error);
    return { success: false };
  }
};

const userRepository = {
  dbLogin,
  createUser,
};

export default userRepository;
