
import { modalRegistry } from "@/lib/modals/registry";
import { CreateNotebookModal, UpdateNotebookModal } from ".";
import { ModalType } from "@/lib/modals/types";
export * from "./CreateNotebookModal";
export * from "./UpdateNotebookModal";
export const NOTEBOOK_MODAL_TYPES = {
  CREATE: "notebook:create",
  UPDATE: "notebook:update",
} as const satisfies Record<string, ModalType>;

export function registerNotebookModals() {
  modalRegistry.register(NOTEBOOK_MODAL_TYPES.CREATE, CreateNotebookModal);
  modalRegistry.register(NOTEBOOK_MODAL_TYPES.UPDATE, UpdateNotebookModal);
}
