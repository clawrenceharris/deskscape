import z from "zod";
import { createProfileSchema, updateProfileSchema } from "@/lib/validation";
import { Profile as PrismaProfile } from "../../generated/prisma/client";

export type CreateProfileFormValues = z.infer<typeof createProfileSchema>;

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export type UserProfile = Pick<PrismaProfile, "id" | "userId" | "username" | "displayName" | "avatarUrl" | "avatarPath">;