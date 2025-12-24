import jwt from "jsonwebtoken";

export const generateToken = (user, res, _next) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN;
  if (!expiresIn) {
    throw new Error("JWT_EXPIRES_IN is not defined in environment variables");
  }
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return token;
};
