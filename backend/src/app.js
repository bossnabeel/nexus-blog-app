import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import adminRouter from "./routes/admindRouter.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import NotFound from "./utils/errors/NotFound.js";
import morgan from 'morgan';
import logger from './utils/logger.js';
import { globalLimit } from "./middleware/rateLimiter.js";

dotenv.config();
connectDb();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); 
}
app.use(helmet())
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(globalLimit)

app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.get("/api", (_req, res) => {
  res.json({ message: "Api is working" });
});

app.use((_req, _res, next) => {
  next(new NotFound("endpoint doesn't exist"));
});

app.use(errorHandler);

// app.listen(process.env.PORT, "0.0.0.0", () => {
//   console.log(`http://0.0.0.0:${process.env.PORT}/api`);
// });

export default app;
