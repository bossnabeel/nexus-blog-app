import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ValidationError } from "../utils/errors/ValidationError.js";
import AuthError from "../utils/errors/AuthError.js";

const searchUser = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const skip = (page - 1) * limit;
  let search = req.query.search;
  let condition = {};
  if (search) {
    search = search.split("+").join(" ");
    condition.OR = [
      { username: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
    ];
  }
  const [users, totalUsers] = await prisma.$transaction([
    prisma.user.findMany({
      skip: skip,
      take: limit,
      where: condition,
      select: {
        id: true,
        username: true,
        created_at: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        created_at: "asc",
      },
    }),
    prisma.user.count({
      where: condition,
    }),
  ]);
  const totalPages = Math.ceil(totalUsers / limit);
  res.status(200).json({
    status: "success",
    data: users,
    pagination: {
      totalUsers: totalUsers,
      totalPages: totalPages,
      current: page,
      limit: limit,
    },
  });
});
const getCurrentUser = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  res.json({
    status: "success",
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      role: user.role,
    },
  });
});
const updateUser = catchAsync(async (req, res) => {
  const { firstName, lastName, username, email } = req.body;
  const user = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    },
  });
});
const register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;
  const usersExist = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });
  if (usersExist) {
    return next(
      new ValidationError("User already exist try different email or username")
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    },
  });
  const token = generateToken(user, res);
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});
const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    return next(new AuthError("Invalid username"));
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return next(new AuthError("Invalid password"));
  }
  const token = generateToken(user, res);
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});
const logout = catchAsync(async (_req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "success",
    message: "logout successfully",
  });
});

export { searchUser, getCurrentUser, updateUser, register, login, logout };
