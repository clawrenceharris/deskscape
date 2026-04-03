import { DeskItem } from "../entities";
import { Desk } from "../entities/Desk";

export interface DeskRepository {
  getUserDesks(userId: string): Promise<Desk[]>;
  getDeskById(id: string): Promise<Desk | null>;
  createDesk(desk: Desk): Promise<Desk>;
  updateDesk(desk: Desk): Promise<Desk>;
  deleteDesk(id: string): Promise<void>;
  getDesksBySchoolId(schoolId: string): Promise<Desk[]>;
  getDeskItemsByDeskId(deskId: string): Promise<DeskItem[]>;
  getDeskItemById(id: string): Promise<DeskItem | null>;
}