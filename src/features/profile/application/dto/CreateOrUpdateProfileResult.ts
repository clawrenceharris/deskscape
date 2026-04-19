import { ProfileForDetail } from "@/features/profile/infrastructure/queries";

export type CreateOrUpdateProfileResult =
  | { success: true; profile: ProfileForDetail }
  | { success: false; error: string };  