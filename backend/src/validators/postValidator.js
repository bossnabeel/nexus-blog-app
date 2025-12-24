import { z } from "zod";
const postSchema = z.object({
  title: z.string().max(200,'Title must be at most 200 characters long').optional(),
  content: z
    .string({
      required_error: "Content is required",
    })
    .min(12, "Content must be at least 12 characters"),
});

const commentSchema = z.object({
  text: z
    .string({
      required_error: "Comment text is required",
    })
    .min(1, "Comment text must be at least 1 character"),
});

export { postSchema, commentSchema };
