import type { CreateUserInput } from "@/pages/api/user/register";
import userRepository from "@/repository/userRepository";
import bcrypt from "bcryptjs";

export const updateUser = async (
  user_id: number,
  user: Partial<CreateUserInput>,
): Promise<void> => {
  await userRepository.updateUser(user_id, user);
};

/**
 * Sanitizes and validates inputs, hashes password
 * Checks for username and email unique constraints
 * Stores user in db
 * @param Params for table user
 */
async function registerUser(data: CreateUserInput): Promise<void> {
  try {
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    await userRepository.createUser({
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPassword,
    });
  } catch (error: any) {
    const pgCode = error?.cause?.code || error?.code;
    // Check for PostgreSQL unique constraint violation (code 23505)
    if (pgCode === "23505") {
      throw new Error("Username or email already taken");
    }

    throw new Error(
      error instanceof Error ? error.message : "Registration failed",
    );
  }
}

/**
 * Deletes user account
 * @param user_id
 * @returns void
 */
async function deleteUser(user_id: number): Promise<void> {
  await userRepository.dbDeleteUser(user_id);
}

const UserService = { updateUser, registerUser, deleteUser };

export default UserService;
