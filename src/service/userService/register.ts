import bcrypt from "bcryptjs";
import userRepository from "@/repository/userRepository";

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

// Simple regex helpers
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const username_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export default async function registerUser({
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
