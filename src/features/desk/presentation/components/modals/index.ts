import { modalRegistry } from "@/lib/modals/registry";
import {  CreateDeskModal } from "./";
export * from "./CreateDeskModal";

export const DESK_MODAL_TYPES = {
  CREATE: "desk:create",
  CREATE_DESK_ITEM: "desk:create-item",
} as const;

export function registerDeskModals() {
  modalRegistry.register(DESK_MODAL_TYPES.CREATE, CreateDeskModal);
}
