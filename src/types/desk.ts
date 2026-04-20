import { createDeskSchema, createNotebookSchema, updateNotebookSchema } from "@/lib/validation";
import z from "zod";

export type CreateDeskFormValues = z.infer<typeof createDeskSchema>;
export type CreateNotebookFormValues = z.infer<typeof createNotebookSchema>;
export type UpdateNotebookFormValues = z.infer<typeof updateNotebookSchema>;

