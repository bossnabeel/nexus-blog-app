import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { catchAsync } from "../utils/catchAsync.js";
import AuthError from "../utils/errors/AuthError.js";

export const authMiddleware = catchAsync(async (req, _res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    req.user = null;
    return next();
  }

    let decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decode.id,
      },
      select: { id: true, username: true, role: true },
    });
    if (!user) {
      return next( new AuthError("user no longer exist"));
    }
    req.user = user;
    next();
});

