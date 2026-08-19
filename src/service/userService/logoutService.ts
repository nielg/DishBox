import { COOKIE_NAME, COOKIE_SECURE } from "astro:env/server";
import type { AstroCookies } from "astro";

const cookieName = COOKIE_NAME || "_Security_Login_";

export const logoutService = (cookies: AstroCookies): void => {
  cookies.delete(cookieName, {
    path: "/",
    secure: Boolean(COOKIE_SECURE || false),
  });
};
