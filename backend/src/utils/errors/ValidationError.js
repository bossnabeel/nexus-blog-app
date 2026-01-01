import CustomError from "../customError.js";

export class ValidationError extends CustomError {
  constructor(message) {
    super("fail", message, 403);
  }
}

export default ValidationError;
