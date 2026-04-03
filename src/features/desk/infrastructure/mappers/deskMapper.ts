import { DeskDto } from "@/types";
import { Desk } from "../../domain/entities/Desk";
type PrismaDesk = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  schoolId: string;
  imageUrl: string | null;
  imagePath: string | null;
  isPublic: boolean;
  creatorId: string;
}
export const deskMapper = (desk: PrismaDesk): Desk => {
  return new Desk({id: desk.id,
    name: desk.name,
    createdAt: desk.createdAt.toISOString(),
    updatedAt: desk.updatedAt.toISOString(),
    schoolId: desk.schoolId,
    imageUrl: desk.imageUrl,
    imagePath: desk.imagePath,
    isPublic: desk.isPublic,
    creatorId: desk.creatorId})

};