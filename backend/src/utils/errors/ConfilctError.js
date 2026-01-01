import CustomError from "../customError.js";

export class ConflictError extends CustomError {
  constructor(message) {
    super("fail", message,409 );
  }
}

export default ConflictError;
