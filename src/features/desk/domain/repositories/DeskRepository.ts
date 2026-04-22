import { SchoolForDetail } from "@/features/school/infrastructure/queries";
import type { CreateDeskData, GetDesksInput, JoinOrLeaveDeskInput } from "../../application/dto";
import type { DeskForDetail, MyDeskForDetail, SchoolDeskForDetail } from "../../infrastructure/queries";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";

export interface DeskRepository {
  getAll(input?: GetDesksInput): Promise<DeskForDetail[]>;
  getById(id: string): Promise<DeskForDetail | null>;
  create(input: CreateDeskData): Promise<DeskForDetail>;
  update(id: string, input: Partial<CreateDeskData>): Promise<DeskForDetail>;
  delete(id: string): Promise<void>;
  join(input: JoinOrLeaveDeskInput): Promise<void>;
  leave(input: JoinOrLeaveDeskInput): Promise<void>;
  createSchoolDesk(school: SchoolForDetail): Promise<SchoolDeskForDetail>;
  createMyDesk(profile: ProfileForDetail): Promise<MyDeskForDetail>;
  getSchoolDesk(schoolId: string): Promise<SchoolDeskForDetail | null>;
}