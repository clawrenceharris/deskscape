import z from "zod"

export const createNotebookSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    materials: z.array(z.object({
      type: z.enum(["NOTES", "WORKSHEET", "QUIZ", "STUDY_GUIDE", "OTHER"]).default("NOTES").optional().nullable(),
      file: z.instanceof(File),
    })),
  });

export const updateNotebookSchema = createNotebookSchema.partial();
  