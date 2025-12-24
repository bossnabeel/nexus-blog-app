class CustomError extends Error {
    constructor (status, message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
export  default CustomError;