import { defineMiddleware } from "astro:middleware";
import { COOKIE_NAME } from "astro:env/server";
import jwt from "jsonwebtoken";

export const onRequest = defineMiddleware((context, next) => {
  const tokenCookie = context.cookies.get(COOKIE_NAME);

  if (tokenCookie?.value) {
    const decoded = jwt.decode(tokenCookie.value) as {
      username?: string;
    } | null;
    if (decoded?.username) {
      context.locals.username = decoded.username;
    }
  }

  return next();
});
