export { CreateProfileModal } from "./CreateProfileModal";
export { CreateProfileForm } from "./CreateProfileForm";

import { modalRegistry } from "@/lib/modals";
import { CreateProfileModal } from "./CreateProfileModal";

/**
 * Modal type constants for profile modals
 */
export const PROFILE_MODAL_TYPES = {
  CREATE: "profile:create",
} as const;

/**
 * Register all profile modals with the modal registry
 * This should be called during app initialization
 */
export function registerProfileModals() {
  modalRegistry.register(PROFILE_MODAL_TYPES.CREATE, CreateProfileModal);
}