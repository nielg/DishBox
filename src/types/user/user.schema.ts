import { z } from "zod";

export const UserLoginSchema = z.object({
  id: z.number(),
  user_name: z.string(),
  email: z.string().email(),
});

export const UserWithPasswordSchema = UserLoginSchema.extend({
  password: z.string(),
});

export type UserLoginResponse = z.infer<typeof UserLoginSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, "Username cannot be empty"),
  password: z
    .string()
    .min(8, "Password needs to be at least 8 characters long"),
});

export type loginInput = z.infer<typeof loginSchema>;
