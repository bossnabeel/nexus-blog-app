import AuthError from "../utils/errors/AuthError.js";

export const isLoginMiddleware = (req, _res, next) => {
  if (!req.user) {
    return next(new AuthError("you're not login"))
  }
  next();
}