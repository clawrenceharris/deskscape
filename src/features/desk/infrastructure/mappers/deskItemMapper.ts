import { DeskItem } from "../../domain/entities/DeskItem";
type PrismaDeskItem = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  deskId: string;
  creatorId: string;
}
export const deskItemMapper = (deskItem: PrismaDeskItem): DeskItem => {
  return new DeskItem({id: deskItem.id,
    title: deskItem.title,
    createdAt: deskItem.createdAt.toISOString(),
    updatedAt: deskItem.updatedAt.toISOString(),
    deskId: deskItem.deskId,
    creatorId: deskItem.creatorId,
    
  });
}