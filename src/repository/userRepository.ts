import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import type { CreateUserInput } from "@/pages/api/user/register";
import {
  type UserLoginResponse,
  UserWithPasswordSchema,
  UserLoginSchema,
} from "@/types/user/user.schema";
import type { UserProfileData } from "@/types/user/user.types";

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

const updateUser = async (
  user_id: number,
  user: Partial<CreateUserInput>,
): Promise<void> => {
  try {
    await sql`
      UPDATE "user"
      SET user_name  = COALESCE(${user.username ?? null}, user_name),
          first_name = COALESCE(${user.firstname ?? null}, first_name),
          last_name  = COALESCE(${user.lastname ?? null}, last_name),
          email      = COALESCE(${user.email ?? null}, email)
      WHERE id = ${user_id}
  `;
  } catch (error) {
    console.error(`DB: Failed to update user ${user_id}`, error);
    throw new Error(`DB: Failed to update user ${user_id}`, { cause: error });
  }
};

const getProfileUserData = async (
  user_id: number,
): Promise<UserProfileData> => {
  let result;
  try {
    result = (await sql`
      SELECT
        user_name as username,
        first_name as firstname,
        last_name as lastname,
        email
      FROM "user"
      WHERE id = ${user_id}
      LIMIT 1
    `) as UserProfileData[];
  } catch (error) {
    console.error(`DB: Failed to fetch user data ${user_id}`, error);
    throw new Error(`DB: Failed to fetch user data ${user_id}`, {
      cause: error,
    });
  }
  return result[0];
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

const addUserFavoriteRecipe = async (
  user_id: number,
  recipe_id: number,
): Promise<void> => {
  try {
    await sql`
      INSERT INTO user_recipes_favorite (user_id, recipe_id)
      VALUES (${user_id}, ${recipe_id});
    `;
  } catch (error) {
    throw new Error(
      `DB: Failed to add favorite recipe id ${recipe_id} to ${user_id}`,
      { cause: error },
    );
  }
};

const removeUserFavoriteRecipe = async (
  user_id: number,
  recipe_id: number,
): Promise<void> => {
  try {
    await sql`
      DELETE FROM user_recipes_favorite
      WHERE user_id = ${user_id} AND recipe_id = ${recipe_id};
    `;
  } catch (error) {
    throw new Error(
      `DB: Failed to remove favorite recipe id ${recipe_id} to ${user_id}`,
      { cause: error },
    );
  }
};

const getAllUserFavoriteRecipesIds = async (
  user_id: number,
): Promise<number[]> => {
  try {
    const result = await sql`
      SELECT recipe_id
      FROM user_recipes_favorite
      WHERE user_id = ${user_id}
      ORDER BY created_at DESC
    `;

    return result.map((row) => Number(row.recipe_id));
  } catch (error) {
    console.error("Failed to get favorite recipes:", error);
    throw error;
  }
};

const userRepository = {
  dbLogin,
  createUser,
  dbDeleteUser,
  updateUser,
  getUserData: getProfileUserData,
  getAllUserFavoriteRecipesIds,
  removeUserFavoriteRecipe,
  addUserFavoriteRecipe,
};

export default userRepository;
