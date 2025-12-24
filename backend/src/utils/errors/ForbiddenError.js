import CustomError from "../customError.js";

export class ForbiddenError extends CustomError {
  constructor(message) {
    super("fail", message, 403);
  }
}

export default ForbiddenError;
