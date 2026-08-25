import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { z } from "zod";

export const UserLoginSchema = z.object({
  id: z.number(),
  user_name: z.string(),
  email: z.string().email(),
});

const UserWithPasswordSchema = UserLoginSchema.extend({
  password: z.string(),
});

// Infer TypeScript types directly from Zod
export type UserLoginResponse = z.infer<typeof UserLoginSchema>;

const dbLogin = async (
  username: string,
  password: string,
): Promise<UserLoginResponse> => {
  let rows;

  try {
    rows = await sql`
      SELECT id, user_name, email, password
      FROM "user"
      WHERE user_name = ${username}
      LIMIT 1
    `;
  } catch (dbError) {
    console.error(`DB: Query failed for user ${username}:`, dbError);
    throw new Error("Database fetch failed");
  }

  const rawRecord = rows[0] ?? null;
  if (!rawRecord) {
    throw new Error("Invalid username or password"); // Generic message for security
  }

  const userRecord = UserWithPasswordSchema.parse(rawRecord);

  const isPasswordValid = await bcrypt.compare(password, userRecord.password);
  if (!isPasswordValid) {
    throw new Error("Invalid username or password");
  }

  return UserLoginSchema.parse(userRecord);
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
}): Promise<void> => {
  try {
    await sql`
      INSERT INTO "user" (user_name, first_name, last_name, email, password)
      VALUES (${username}, ${firstName}, ${lastName}, ${email}, ${password})
    `;
  } catch (error) {
    console.error(`DB: Failed to create user ${username}`, error);
    throw Error("DB: Failed to create user");
  }
};

const dbDeleteUser = async (user_id: number): Promise<void> => {
  try {
    await sql`
      DELETE FROM "user"
      WHERE id = ${user_id}
    `;
  } catch (error) {
    throw Error(`DB: Failed to delete user ${user_id}`, { cause: error });
  }
};

const userRepository = {
  dbLogin,
  createUser,
  dbDeleteUser,
};

export default userRepository;
