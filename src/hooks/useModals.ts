import { useDeskContext, useLayout, useModal, useUser } from "@/app/providers";
import { DESK_MODAL_TYPES } from "@/features/desk/presentation/components/modals";
import { NOTEBOOK_MODAL_TYPES } from "@/features/notebook/presentation/components/modals";
import { CreateNotebookModalProps, CreateDeskModalProps, CreateProfileModalProps, UpdateNotebookModalProps, UpdateDeskModalProps, UpdateProfileModalProps } from "@/lib/modals/types";
import { PROFILE_MODAL_TYPES } from "@/features/profile/presentation/components/modals";
import { useQueryClient } from "@tanstack/react-query";
import { DeskForDetail } from "@/features/desk/infrastructure/queries";
import { notebookKeys, deskKeys, profileKeys } from "@/lib/queries/keys";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";


export function useModals() {
    const { openModal, closeModal } = useModal();
    const { openRightLayout } = useLayout();
    const queryClient = useQueryClient();
    const {setCurrentDeskId, setCurrentNotebookId} = useDeskContext();
    const { user, profile } = useUser();
    
    function handleCreateDesk (desk: DeskForDetail) {
        queryClient.invalidateQueries({ queryKey: deskKeys.detail(desk.id) });
        queryClient.invalidateQueries({ queryKey: deskKeys.lists() });
        setCurrentDeskId(desk.id);
        closeModal();
    }
    function handleUpdateDesk (desk: DeskForDetail) {
        queryClient.invalidateQueries({ queryKey: deskKeys.lists() });
        queryClient.invalidateQueries({ queryKey: deskKeys.detail(desk.id) });
        closeModal();
    }
    function handleCreateNotebook (notebook: NotebookForDetail) {
        queryClient.invalidateQueries({ queryKey: notebookKeys.listByDeskId(notebook.deskId) });
        queryClient.invalidateQueries({ queryKey: notebookKeys.listByUserId(notebook.creatorId) });
        queryClient.invalidateQueries({ queryKey: deskKeys.listByUserId(notebook.creatorId) });

        setCurrentNotebookId(notebook.id);
        setCurrentDeskId(notebook.deskId);
        openRightLayout();
        closeModal();
    }
    function handleUpdateNotebook (notebook: NotebookForDetail) {
        queryClient.invalidateQueries({ queryKey: notebookKeys.listByDeskId(notebook.deskId) });
        queryClient.invalidateQueries({ queryKey: notebookKeys.detail(notebook.id) });
        closeModal();
    }
    function handleCreateProfile (profile: ProfileForDetail) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(profile.userId) });
        closeModal();
    }
    function handleUpdateProfile (profile: ProfileForDetail) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(profile.userId) });
        closeModal();
    }
    const modals = {
        [DESK_MODAL_TYPES.CREATE]: {
            open: () => {
                openModal<CreateDeskModalProps>(DESK_MODAL_TYPES.CREATE, {
                    userId: user.id,
                    onSuccess: handleCreateDesk,
                    onCancel: closeModal
                });
            }
        },
        [DESK_MODAL_TYPES.UPDATE]: {
            open: (deskId: string) => {
                openModal<UpdateDeskModalProps>(DESK_MODAL_TYPES.UPDATE, {
                    deskId: deskId,
                    onSuccess: handleUpdateDesk,
                    onCancel: closeModal
                });
            }
        },
        [NOTEBOOK_MODAL_TYPES.CREATE]: {
            open: (deskId: string) => {
                openModal<CreateNotebookModalProps>(NOTEBOOK_MODAL_TYPES.CREATE, {
                    deskId: deskId,
                    onSuccess: handleCreateNotebook,
                    onCancel: closeModal
                });
            }
        },
        [NOTEBOOK_MODAL_TYPES.UPDATE]: {
            open: (notebookId: string) => {
                openModal<UpdateNotebookModalProps>(NOTEBOOK_MODAL_TYPES.UPDATE, {
                    notebookId,
                    onSuccess: handleUpdateNotebook,
                    onCancel: closeModal
                });
            }
        },
        [PROFILE_MODAL_TYPES.CREATE]: {
            open: () => {
                openModal<CreateProfileModalProps>(PROFILE_MODAL_TYPES.CREATE, {
                    userId: user.id,
                    onSuccess: handleCreateProfile,
                    onCancel: closeModal,
                });
            }
        },
        [PROFILE_MODAL_TYPES.UPDATE]: {
            open: () => {
                openModal<UpdateProfileModalProps>(PROFILE_MODAL_TYPES.UPDATE, {
                    profile,
                    onSuccess: handleUpdateProfile,
                    onCancel: closeModal,
                });
            }
        },
    }
    return {modals};
}