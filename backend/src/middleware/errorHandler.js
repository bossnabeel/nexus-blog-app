import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Internal Error";
  let status = err.status || "error";
  if (err.code === "P2002") {
    statusCode = 400;
    message = `Duplicate field value: ${err.meta.target}`;
  }
  if(err.code ===  'P1001'){
    statusCode = 400;
    message = `DB server is not running`;
  }
  if (err.name === "ZodError") {
    err.status = "fail";
    err.statusCode = 400;
    err.message = "Validation failed";
  }
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });
  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
