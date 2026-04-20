import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(25, "Username must be less than 25 characters")
  .regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores, and periods");

const avatarFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= 15 * 1024 * 1024, "Image must be 15MB or smaller")
  .refine(
    (f) => f.type.startsWith("image/"),
    "Please choose an image file"
  );

export const createProfileSchema = z.object({
  displayName: z
    .string()
    .max(50)
    .optional()
    .refine(
      (name) => !name || name.trim().length !== 1,
      "Name must be at least 2 characters"
    ),
  schoolId: z.string().min(1, "Please select a school"),
  username: usernameSchema,
  avatarFile: z
    .union([avatarFileSchema, z.null()])
    .optional(),
});

export const updateProfileSchema = createProfileSchema.partial();