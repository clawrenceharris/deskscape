import { DeskForDetail } from "../../infrastructure/queries";

export type CreateDeskResult =
  | { success: true; desk: DeskForDetail }
  | { success: false; error: string };
