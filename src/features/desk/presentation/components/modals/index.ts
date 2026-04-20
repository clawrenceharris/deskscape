import { modalRegistry } from "@/lib/modals/registry";
import {  CreateDeskModal } from "./";
import { ModalType } from "@/lib/modals/types";
export * from "./CreateDeskModal";

export const DESK_MODAL_TYPES = {
  CREATE: "desk:create",
  UPDATE: "desk:update",
} as const satisfies Record<string, ModalType>;

export function registerDeskModals() {
  modalRegistry.register(DESK_MODAL_TYPES.CREATE, CreateDeskModal);
}
