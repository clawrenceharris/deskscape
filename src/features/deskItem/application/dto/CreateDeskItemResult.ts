import { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";

export type CreateDeskItemResult =
  | { success: true; deskItem: DeskItemForDetail }
  | { success: false; error: string };