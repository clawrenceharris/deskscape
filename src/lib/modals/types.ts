import { UserProfileDto } from "@/types/profile";
import { User } from "@supabase/supabase-js";

/**
 * Base interface for all modal props
 * CRUD modals do NOT include isLoading - they handle it internally via usePendingMutations
 */
export interface ModalProps {
  [key: string]: unknown;
}

/**
 * Union type of all modal type strings
 */
export type ModalType =
  | "profile:create"
  | "profile:delete"
  | "desk:create"
  | "desk:update"
  | "desk:delete"
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
  onSuccess?: (profile: UserProfileDto) => void;
  user: User;
}
