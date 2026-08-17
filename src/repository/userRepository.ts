import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import type { dbResponse } from "@/types";
import type { UserLoginResponse } from "@/types/user";

type UserWithPassword = UserLoginResponse & {
  password: string;
};

const dbLogin = async (
  username: string,
  password: string,
): Promise<dbResponse<UserLoginResponse | null>> => {
  try {
    const rows = await sql<UserWithPassword[]>`
      SELECT id, user_name, email, password
      FROM "user"
      WHERE user_name = ${username}
      LIMIT 1
    `;

    const userRecord = rows[0] ?? null;

    if (!userRecord) {
      return {
        success: false,
        result: null,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, userRecord.password);

    if (!isPasswordValid) {
      return {
        success: false,
        result: null,
      };
    }

    // Exclude password hash before returning the user result
    const { password: _, ...user } = userRecord;

    return {
      success: true,
      result: user,
    };
  } catch (error) {
    console.error(`DB: Query failed for user ${username}:`, error);
    throw new Error("Database fetch failed");
  }
};

const createUser = async ({
  username,
  firstName,
  lastName,
  email,
  password,
}: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ success: boolean }> => {
  try {
    await sql`
      INSERT INTO "user" (user_name, first_name, last_name, email, password)
      VALUES (${username}, ${firstName}, ${lastName}, ${email}, ${password})
    `;

    return { success: true };
  } catch (error) {
    console.error(`DB: Failed to create user ${username}`, error);
    return { success: false };
  }
};

const userRepository = {
  dbLogin,
  createUser,
};

export default userRepository;
