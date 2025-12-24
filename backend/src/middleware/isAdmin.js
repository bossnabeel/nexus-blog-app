import { ForbiddenError} from  '../utils/errors/ForbiddenError.js'
const isAdmin = async (req, _res, next) => {
  const userRole = req.user.role;
  if (userRole !== "ADMIN") {
    return next(new ForbiddenError("Access Denied: Only Administrators can perform this action."));
  }
  next();
};

export { isAdmin };
