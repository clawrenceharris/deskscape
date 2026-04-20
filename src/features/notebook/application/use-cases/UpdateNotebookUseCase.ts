import { NotebookRepository } from "../../domain/repositories";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { UpdateNotebookInput } from "../dto";
import { DeskStorage } from "@/features/desk/domain/services";
import { getCurrentUser } from "@/features/auth/server";
import { ApplicationError, ApplicationResultWithData } from "@/shared/kernel";
import { NotebookForDetail } from "../../infrastructure/queries";

export class UpdateNotebookUseCase {
    constructor(
        private readonly repository: NotebookRepository,
        private readonly storage: DeskStorage
    ) {}
    async execute(input: UpdateNotebookInput): Promise<ApplicationResultWithData<NotebookForDetail>> {
        const uploadedPaths: string[] = [];
        try {
            const [user, existingNotebook] = await Promise.all([
                getCurrentUser(),
                this.repository.getById(input.notebookId),
            ]);
            if (!user) {
                return { success: false as const, error: new ApplicationError("User not found") };
            }
            if (!existingNotebook) {
                return { success: false as const, error: new ApplicationError("Notebook not found") };
            }

            const existingMaterials = existingNotebook.materials;
            const existingMaterialIds = new Set(existingMaterials.map((material) => material.id));
            const explicitRemoveIds = new Set(
                (input.data.removeMaterialIds ?? []).filter((id) => existingMaterialIds.has(id))
            );
            const keepMaterialIds = input.data.keepMaterialIds
                ? new Set(input.data.keepMaterialIds.filter((id) => existingMaterialIds.has(id)))
                : null;
            const materialIdsToDelete = new Set<string>();
            if (keepMaterialIds) {
                for (const material of existingMaterials) {
                    if (!keepMaterialIds.has(material.id)) {
                        materialIdsToDelete.add(material.id);
                    }
                }
            }
            for (const id of explicitRemoveIds) {
                materialIdsToDelete.add(id);
            }

            const uploadedMaterials = await Promise.all(
                (input.data.materials ?? []).map(async (material) => {
                    const uploaded = await this.storage.uploadFile({
                        file: material.file,
                        userId: user.id,
                        deskId: existingNotebook.deskId,
                    });
                    uploadedPaths.push(uploaded.path);
                    return {
                        type: material.type ?? "OTHER",
                        url: uploaded.url,
                        path: uploaded.path,
                        title: material.file.name,
                        mimeType: material.file.type,
                        authorId: user.id,
                    };
                })
            );

            const updated = await this.repository.update({
                notebookId: input.notebookId,
                title: input.data.title,
                description: input.data.description,
                materialsToCreate: uploadedMaterials.length > 0 ? uploadedMaterials : undefined,
                materialIdsToDelete: materialIdsToDelete.size > 0 ? Array.from(materialIdsToDelete) : undefined,
            });

            const pathsToDelete = existingMaterials
                .filter((material) => materialIdsToDelete.has(material.id))
                .map((material) => material.path);
            if (pathsToDelete.length > 0) {
                await Promise.allSettled(pathsToDelete.map((path) => this.storage.remove(path)));
            }
            return { success: true as const, data: updated };
        } catch (error) {
            if (uploadedPaths.length > 0) {
                await Promise.allSettled(uploadedPaths.map((path) => this.storage.remove(path)));
            }
            console.error("Error updating notebook", error);
            return { success: false as const, error: new ApplicationError(getUserErrorMessage(error)) };
        }
    }
}