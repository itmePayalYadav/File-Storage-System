import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .min(1)
  .max(255);

export const passwordSchema = z.string().trim().min(4);

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(20, 'Name must be less than 20 characters'),
  email: emailSchema,
  password: passwordSchema,
  profilePicture: z.string().optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
