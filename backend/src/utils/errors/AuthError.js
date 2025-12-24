import CustomError from "../customError.js";

export class AuthError extends CustomError {
  constructor(message) {
    super("fail", message, 401);
  }
}

export default AuthError;
