import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import adminRouter from "./routes/adminRouter.js";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import NotFound from "./utils/errors/NotFound.js";
import morgan from "morgan";
import logger from "./utils/logger.js";
import { globalLimit } from "./middleware/rateLimiter.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };

dotenv.config();
connectDb();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(globalLimit);
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
const options = {
  swaggerOptions: {
    url: "/api-docs/swagger.json",
  },
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
  ],
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

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
