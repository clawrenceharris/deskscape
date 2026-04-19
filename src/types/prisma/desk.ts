import { Desk, DeskItem, Material, Prisma } from "../../../generated/prisma/client";
import { PrismaProfile } from "./profile";

export interface PrismaMaterial extends Pick<Material, "id" | "url" | "type" | "deskItemId" | "title" | "fileName" | "mimeType" | "createdAt" | "updatedAt"> {
  author: PrismaProfile;
}
export interface PrismaDeskItem extends DeskItem {
  materials: PrismaMaterial[];
  creator: PrismaProfile;

}

export interface PrismaDesk extends Desk {
  items: PrismaDeskItem[];
  creator: PrismaProfile;
}
