import ValidationError from '../utils/errors/ValidationError.js';
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  
  if (!result.success) {
    const flattened = result.error.flatten();
    const errorMessages = Object.values(flattened.fieldErrors)
      .flat()
      .join(', ');
    return next(new ValidationError(errorMessages));
  }
  
  next();
};