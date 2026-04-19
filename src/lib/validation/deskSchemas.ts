import { MaterialType } from "@/features/materials/domain/value-objects";
import z from "zod";

export const createDeskSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  schoolId: z.uuid("Please select a school"),
  imageFile: z.instanceof(File)
    .refine((f) => f && f.size <= 10 * 1024 * 1024, "Image must be 10MB or smaller")
    .refine((f) => f && f.type.startsWith("image/"), "Please choose an image file").nullable().optional(),
  isPublic: z.boolean().optional(),
  description: z.string().optional(),
  
});
export const createDeskItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  materials: z.array(z.object({
    type: z.enum(["NOTES", "WORKSHEET", "QUIZ", "STUDY_GUIDE", "OTHER"]).default("NOTES").optional().nullable(),
    file: z.instanceof(File),
  })),
});
export const updateDeskItemSchema = createDeskItemSchema.partial();
