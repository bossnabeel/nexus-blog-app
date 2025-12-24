import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2,'First name must be at least 2 characters long'),
  lastName: z.string().min(2,'Last name must be at least 2 characters long'),
  username: z.string().min(3,'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8,'Password must be at least 8 characters long'),
});

export const loginSchema = z.object({
  username: z.string().min(3,'Username must be at least 3 characters long'),
  password: z.string().min(8,'Password must be at least 8 characters long'),
});
