import CustomError from "../customError.js";

export class NotFound extends CustomError {
    constructor(message){
        super('fail',message, 404);
    }
}
export default NotFound;
