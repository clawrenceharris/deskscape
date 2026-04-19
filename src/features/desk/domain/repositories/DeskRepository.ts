import type { CreateDeskData, GetDesksInput } from "../../application/dto";
import type { DeskForDetail } from "../../infrastructure/queries";

export interface DeskRepository {
  getDesks(input?: GetDesksInput): Promise<DeskForDetail[]>;
  getById(id: string): Promise<DeskForDetail | null>;
  create(input: CreateDeskData): Promise<DeskForDetail>;
  updateDesk(id: string, input: Partial<CreateDeskData>): Promise<DeskForDetail>;
  deleteDesk(id: string): Promise<void>;

}