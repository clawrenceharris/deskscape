import { createDeskItemSchema, createDeskSchema, updateDeskItemSchema } from "@/lib/validation";
import z from "zod";
import type { MaterialType as PrismaMaterialType,  Desk as PrismaDesk, DeskItem as PrismaDeskItem, Material as PrismaMaterial } from "../../generated/prisma/client";
import { UserProfile } from "./profile";

export type DeskInsert = Pick<PrismaDesk, "name" | "schoolId" | "imageUrl" | "imagePath" | "isPublic" | "creatorId" | "description">;
export type DeskItemInsert = Pick<PrismaDeskItem, "title" | "deskId" | "creatorId" | "description">;

export type MaterialType = PrismaMaterialType;
export interface Desk extends Pick<PrismaDesk, "id" | "name" | "schoolId" | "imageUrl" | "imagePath" | "isPublic" | "creatorId">{
  items: DeskItem[];
  createdAt: string;
  updatedAt: string;
}
export interface DeskItem extends Pick<PrismaDeskItem, "id" | "title" | "deskId" | "creatorId">{
  materials: Material[];
  createdAt: string;
  updatedAt: string;
  creator: UserProfile
};

export interface Material extends Pick<PrismaMaterial, "id" | "url" | "type" | "deskItemId" | "title" | "fileName" | "mimeType">{
  author: UserProfile;
  createdAt: string;
  updatedAt: string;
}

// Application Inputs
export interface DeskItemCreateInput extends Pick<PrismaDeskItem, "title" | "deskId" | "creatorId" | "description">{
  materials: Array<Pick<PrismaMaterial, "type" | "url" | "fileName" | "mimeType" | "title" | "authorId">>;
}
export interface DeskCreateInput extends Pick<PrismaDesk, "name" | "schoolId" | "creatorId" | "description" | "isPublic">{
  imageUrl: string | null;
  imagePath: string | null;
}

export interface DeskUpdateInput extends Pick<PrismaDesk, "name" | "description">{
  imageUrl?: string;
  imagePath?: string;
  isPublic?: boolean;
}

//Zod Form values
export type CreateDeskFormValues = z.infer<typeof createDeskSchema>;
export type CreateDeskItemFormValues = z.infer<typeof createDeskItemSchema>;
export type UpdateDeskItemFormValues = z.infer<typeof updateDeskItemSchema>;


// Application DTOs
export interface CreateDeskDto {
  name: string;
  schoolId: string;
  imageFile: File | null;
  isPublic: boolean;
  creatorId: string;
}