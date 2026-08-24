import type { AstroCookies } from "astro";
import {
  COOKIE_NAME,
  COOKIE_SECURE,
  COOKIE_SECRET,
  MAX_AGE,
} from "astro:env/server";
import jwt from "jsonwebtoken";
import userRepository, {
  type UserLoginResponse,
} from "@/repository/userRepository";
import bcrypt from "bcryptjs";
import type { CreateUserInput } from "@/pages/api/user/register";

type RegisterResponse = {
  success: boolean;
  message: string;
};

/**
 * Checks user credentials if success create jwt token
 * @param username, password
 * @returns LoginResponse
 */
async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<string> {
  const loginData: UserLoginResponse = await userRepository.dbLogin(
    username,
    password,
  );

  const expire = Math.floor(Date.now() / 1000) + MAX_AGE;
  const token = jwt.sign(
    {
      exp: expire,
      id: loginData.id,
      email: loginData.email,
      username: loginData.user_name,
    },
    COOKIE_SECRET,
  );
  return token;
}

/**
 * Verifys the token and returns user_id if found
 * If not found delete the cookie with the logoutService function and return null
 * @param cookies
 * @returns null | user_id
 */
async function getAuthenticatedUserId(
  cookies: AstroCookies,
): Promise<number | null> {
  const cookie = cookies.get(COOKIE_NAME);

  if (!cookie?.value) return null;

  try {
    const decoded = jwt.verify(cookie.value, COOKIE_SECRET) as {
      id?: number;
    } | null;
    if (decoded?.id) return decoded.id;
  } catch (error) {
    console.warn("Token verification failed");
  }

  await logout(cookies);
  return null;
}

/**
 * Deletes jwt from cookie holder
 * @param cookies
 */
const logout = (cookies: AstroCookies): void => {
  cookies.delete(COOKIE_NAME, {
    path: "/",
    secure: Boolean(COOKIE_SECURE || false),
  });
};

//  regex helpers for registerUser
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const username_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

/**
 * Sanitizes and validates inputs, hashes password
 * Checks for username and email unique constraints
 * Stores user in db
 * @param Params vor table user
 * @returns RegisterResponse
 */
async function registerUser(data: CreateUserInput): Promise<RegisterResponse> {
  // Sanitize Inputs (trim whitespace)
  const cleanusername = data.username.trim();
  const cleanFirstname = data.firstname.trim();
  const cleanLastname = data.lastname.trim();
  const cleanEmail = data.email.trim().toLowerCase();

  // Validate Email Format
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return { success: false, message: "Invalid email format." };
  }

  // Validate username Format
  if (!username_REGEX.test(cleanusername)) {
    return {
      success: false,
      message:
        "username must be 3-30 characters long and contain only letters, numbers, or underscores.",
    };
  }

  try {
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const dbResult = await userRepository.createUser({
      username: cleanusername,
      firstName: cleanFirstname,
      lastName: cleanLastname,
      email: cleanEmail,
      password: hashedPassword,
    });

    if (!dbResult.success) {
      return { success: false, message: "User registration failed." };
    }

    return { success: true, message: "User registered successfully." };
  } catch (error: any) {
    // Check for PostgreSQL unique constraint violation (code 23505)
    if (error?.code === "23505") {
      return {
        success: false,
        message: "username or email is already taken.",
      };
    }

    console.error("Registration error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

/**
 * Deletes user account
 * @param user_id
 * @returns Success boolean
 */
async function deleteUser(user_id: number): Promise<boolean> {
  return false;
}

const authService = {
  registerUser,
  login,
  logout,
  getAuthenticatedUserId,
  deleteUser,
};

export default authService;
