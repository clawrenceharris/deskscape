import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
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
  | "notebook:create"
  | "notebook:update"
  | "notebook:delete"

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
  userId: string;
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
  onSuccess?: (desk: DeskForDetail) => void;
  
}
export interface UpdateDeskModalProps extends ModalProps {
  deskId: string;
  onSuccess?: (desk: DeskForDetail) => void;
  onCancel?: () => void;
}


// ============================================================================
// Notebook Modal Props
// ============================================================================

export interface CreateNotebookModalProps extends ModalProps {
  deskId: string;
  onSuccess?: (notebook: NotebookForDetail) => void;
  
}

export interface UpdateNotebookModalProps extends ModalProps {
  notebookId: string;
  onSuccess?: (notebook: NotebookForDetail) => void;
 
}