import z from "zod";
import { createProfileSchema } from "@/lib/validation";

export type CreateProfileFormValues = z.infer<typeof createProfileSchema>;

export type UserProfileDto = {
    userId: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    avatarPath: string | null;
}