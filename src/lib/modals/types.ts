import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { SchoolDto } from "@/types/school";
import { User } from "@supabase/supabase-js";
import { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";
import { DeskForDetail } from "@/features/desk/infrastructure/queries";

/**
 * Base interface for all modal props
 */
export interface ModalProps {
  [key: string]: unknown;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

/**
 * Union type of all modal type strings
 */
export type ModalType =
  | "profile:create"
  | "profile:delete"
  | "profile:update"
  | "desk:create"
  | "desk:update"
  | "desk:delete"
  | "desk-item:create"
  | "desk-item:update"
  | "material:update"
  | "material:delete"
  | "material:create";

/**
 * State interface for ModalProvider
 */
export interface ModalState {
  type: ModalType | null;
  props: ModalProps | null;
}

// ============================================================================
// Profile Modal Props
// ============================================================================

export interface CreateProfileModalProps extends ModalProps {
  onSuccess?: (profile: ProfileForDetail) => void;
  user: User;
}

export interface UpdateProfileModalProps extends ModalProps {
  profile: ProfileForDetail;
  onSuccess?: (profile: ProfileForDetail) => void;
  onCancel?: () => void;
}

// ============================================================================
// Desk Modal Props
// ============================================================================

export interface CreateDeskModalProps extends ModalProps {
  userId: string;
  currentSchoolId: string;
  onSuccess?: (desk: DeskForDetail) => void;
  
}

export interface CreateDeskItemModalProps extends ModalProps {
  deskId: string;
  onSuccess?: (deskItem: DeskItemForDetail) => void;
  
}

export interface UpdateDeskItemModalProps extends ModalProps {
  deskItemId: string;
  onSuccess?: (deskItem: DeskItemForDetail) => void;
 
}