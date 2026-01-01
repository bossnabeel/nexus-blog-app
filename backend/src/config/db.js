import { PrismaClient } from "@prisma/client";
import { catchAsync } from "../utils/catchAsync.js";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});
const connectDb = catchAsync( async () => {

    await prisma.$connect();
    console.log("DB Connected via Prisma");
  })
const disconnectDb = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDb, disconnectDb };
