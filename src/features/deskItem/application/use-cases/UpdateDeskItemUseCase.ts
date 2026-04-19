import { DeskItemRepository } from "../../domain/repositories";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { UpdateDeskItemResult,UpdateDeskItemInput } from "../dto";
import { DeskStorage } from "@/features/desk/domain/services";
import { getCurrentUser } from "@/features/auth/server";

export class UpdateDeskItemUseCase {
    constructor(
        private readonly repository: DeskItemRepository,
        private readonly storage: DeskStorage
    ) {}
    async execute(input: UpdateDeskItemInput): Promise<UpdateDeskItemResult> {
        const uploadedPaths: string[] = [];
        try {
            const [user, existingDeskItem] = await Promise.all([
                getCurrentUser(),
                this.repository.getById(input.deskItemId),
            ]);
            if (!user) {
                return { success: false as const, error: "User not found" };
            }
            if (!existingDeskItem) {
                return { success: false as const, error: "Desk item not found" };
            }

            const existingMaterials = existingDeskItem.materials;
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
                        deskId: existingDeskItem.deskId,
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
                deskItemId: input.deskItemId,
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
            console.error("Error updating desk item", error);
            return { success: false as const, error: getUserErrorMessage(error) };
        }
    }
}