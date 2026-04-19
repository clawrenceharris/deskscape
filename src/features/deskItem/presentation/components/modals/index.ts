
import { modalRegistry } from "@/lib/modals/registry";
import { CreateDeskItemModal, UpdateDeskItemModal } from "./";
import { ModalType } from "@/lib/modals/types";
export * from "./CreateDeskItemModal";
export * from "./UpdateDeskItemModal";
export const DESK_ITEM_MODAL_TYPES = {
  CREATE: "desk-item:create",
  UPDATE: "desk-item:update",
} as const satisfies Record<string, ModalType>;

export function registerDeskItemModals() {
  modalRegistry.register(DESK_ITEM_MODAL_TYPES.CREATE, CreateDeskItemModal);
  modalRegistry.register(DESK_ITEM_MODAL_TYPES.UPDATE, UpdateDeskItemModal);
}
