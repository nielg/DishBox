import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import type { CreateUserInput } from "@/pages/api/user/register";
import {
  type UserLoginResponse,
  UserWithPasswordSchema,
  UserLoginSchema,
} from "@/types/user/user.schema";

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
    throw new Error("Invalid username or password");
  }

  const userRecord = UserWithPasswordSchema.parse(rawRecord);

  const isPasswordValid = await bcrypt.compare(password, userRecord.password);
  if (!isPasswordValid) {
    throw new Error("Invalid username or password");
  }

  return UserLoginSchema.parse(userRecord);
};

const createUser = async (user: CreateUserInput): Promise<void> => {
  try {
    await sql`
      INSERT INTO "user" (user_name, first_name, last_name, email, password)
      VALUES (${user.username}, ${user.firstname}, ${user.lastname}, ${user.email}, ${user.password})
    `;
  } catch (error) {
    console.error(`DB: Failed to create user ${user.username}`, error);
    throw new Error("DB: Failed to create user", { cause: error });
  }
};

const dbDeleteUser = async (user_id: number): Promise<void> => {
  let result;
  try {
    result = await sql`
      DELETE FROM "user"
      WHERE id = ${user_id}
    `;
  } catch (error) {
    throw Error(`DB: Failed to delete user ${user_id}`, { cause: error });
  }
  if (result.count === 0) {
    throw new Error(`User with ID ${user_id} not found`);
  }
};

const userRepository = {
  dbLogin,
  createUser,
  dbDeleteUser,
};

export default userRepository;
