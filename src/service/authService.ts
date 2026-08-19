import type { AstroCookies } from "astro";
import {
  COOKIE_NAME,
  COOKIE_SECURE,
  COOKIE_SECRET,
  MAX_AGE,
} from "astro:env/server";
import jwt from "jsonwebtoken";
import userRepository from "@/repository/userRepository";
import type { dbResponse } from "@/types";
import type { UserLoginResponse } from "@/types/user";
import bcrypt from "bcryptjs";

type RegisterInput = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  success: boolean;
  message: string;
};

type LoginResponse =
  | { success: false; token: null; max: null }
  | { success: true; token: string; max: number };

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
}): Promise<LoginResponse> {
  const loginData: dbResponse<UserLoginResponse | null> =
    await userRepository.dbLogin(username, password);

  if (loginData.success === false || loginData.result == null) {
    return { success: false, token: null, max: null };
  }

  const expire = Math.floor(Date.now() / 1000) + MAX_AGE;
  const token = jwt.sign(
    {
      exp: expire,
      id: loginData.result.id,
      email: loginData.result.email,
      username: loginData.result.user_name,
    },
    COOKIE_SECRET,
  );
  return { success: true, token: `${token}`, max: MAX_AGE };
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
async function registerUser({
  username,
  firstName,
  lastName,
  email,
  password,
}: RegisterInput): Promise<RegisterResponse> {
  // Sanitize Inputs (trim whitespace)
  const cleanusername = username.trim();
  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Validate Required Fields
  if (
    !cleanusername ||
    !cleanFirstName ||
    !cleanLastName ||
    !cleanEmail ||
    !password
  ) {
    return { success: false, message: "All fields are required." };
  }

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

  // Validate Password Strength (Minimum 8 characters)
  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters long.",
    };
  }

  try {
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const dbResult = await userRepository.createUser({
      username: cleanusername,
      firstName: cleanFirstName,
      lastName: cleanLastName,
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

const authService = {
  registerUser,
  login,
  logout,
  getAuthenticatedUserId,
};

export default authService;
