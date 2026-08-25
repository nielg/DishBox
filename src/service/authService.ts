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
import type { loginInput } from "@/pages/api/user/login";

type RegisterResponse = {
  success: boolean;
  message: string;
};

/**
 * Checks user credentials if success create jwt token
 * @param username, password
 * @returns LoginResponse
 */
async function login(data: loginInput): Promise<string> {
  const loginData: UserLoginResponse = await userRepository.dbLogin(
    data.username,
    data.password,
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
type AuthResult =
  | { success: true; user_id: number }
  | { success: false; response: Response };

async function getAuthenticatedUserId(
  cookies: AstroCookies,
): Promise<AuthResult> {
  const cookie = cookies.get(COOKIE_NAME);

  if (!cookie?.value) {
    return {
      success: false,
      response: Response.json(
        { success: false, message: "Authentication failed" },
        { status: 401 },
      ),
    };
  }

  try {
    const decoded = jwt.verify(cookie.value, COOKIE_SECRET) as {
      id?: number;
    } | null;
    if (decoded?.id) {
      return { success: true, user_id: decoded.id };
    }
  } catch (error) {
    console.warn("Token verification failed");
  }

  await logout(cookies);

  return {
    success: false,
    response: Response.json(
      { success: false, message: "Authentication failed" },
      { status: 401 },
    ),
  };
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

/**
 * Sanitizes and validates inputs, hashes password
 * Checks for username and email unique constraints
 * Stores user in db
 * @param Params for table user
 */
async function registerUser(data: CreateUserInput): Promise<void> {
  // Sanitize Inputs (trim whitespace)
  const cleanusername = data.username.trim();
  const cleanFirstname = data.firstname.trim();
  const cleanLastname = data.lastname.trim();
  const cleanEmail = data.email.trim().toLowerCase();

  try {
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    await userRepository.createUser({
      username: cleanusername,
      firstName: cleanFirstname,
      lastName: cleanLastname,
      email: cleanEmail,
      password: hashedPassword,
    });
  } catch (error: any) {
    // Check for PostgreSQL unique constraint violation (code 23505)
    if (error?.code === "23505") {
      throw Error("Username or email already taken");
    }

    throw Error("Registration failed", error.message);
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
