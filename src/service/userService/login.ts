import wbtl from "jsonwebtoken";
import userRepository from "@/repository/userRepository";
import type { dbResponse } from "@/types";
import type { UserLoginResponse } from "@/types/user";

type LoginResponse =
  | { success: false; token: null; max: null }
  | { success: true; token: string; max: number };

export default async function login({
  username,
  password,
  maxAge,
  secret,
}: {
  username: string;
  password: string;
  maxAge: number;
  secret: string;
}): Promise<LoginResponse> {
  const loginData: dbResponse<UserLoginResponse | null> =
    await userRepository.dbLogin(username, password);

  if (loginData.success === false || loginData.result == null) {
    return { success: false, token: null, max: null };
  }

  const expire = Math.floor(Date.now() / 1000) + maxAge;
  const token = wbtl.sign(
    {
      exp: expire,
      id: loginData.result.id,
      email: loginData.result.email,
      username: loginData.result.user_name,
    },
    secret,
  );
  return { success: true, token: `${token}`, max: maxAge };
}
