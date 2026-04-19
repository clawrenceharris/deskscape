import { DeskStorage } from "@/features/desk/domain/services";
import { DeskItemRepository } from "../../domain/repositories";
import type { CreateDeskItemInput, CreateDeskItemResult } from "../dto";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { getCurrentUser } from "@/features/auth/server";


export class CreateDeskItemUseCase {
    constructor(private readonly repository: DeskItemRepository, private readonly storage: DeskStorage) {}
    async execute(input: CreateDeskItemInput): Promise<CreateDeskItemResult> {
        let uploads: { path: string; url: string }[] = [];
      try {
        //1. Get creator id from session
        const user = await getCurrentUser();
        if (!user) {
          return {
            success: false as const,
            error: "User not found",
          };
        }
        // 1. Upload files
        const uploadedMaterials = await Promise.all(
          input.materials.map(async (m) => {
            const uploaded = await this.storage.uploadFile({
              file: m.file,
              userId: user.id,
              deskId: input.deskId,
            });
    
            return {
              type: m.type,
              url: uploaded.url,
              path: uploaded.path,
              fileName: m.file.name,
              title: m.title ?? m.file.name,
              mimeType: m.file.type,
              authorId: user.id,
            };
          })
        );
        uploads = uploadedMaterials.map((u) => ({ path: u.path, url: u.url }));
        // 2. Save to DB
        const deskItem = await this.repository.create({
          deskId: input.deskId,
          creatorId: user.id,
          title: input.title,
          description: input.description ?? null,
          materials: uploadedMaterials,
        });
    
        return {
          success: true as const,
          deskItem: deskItem,
        };
      } catch (error) {
        console.error("Error creating desk item", error);
        try{
          if (uploads.length > 0) {
            await Promise.all(uploads.map(async (m) => {
              await this.storage.remove(m.path);
            }));
          }
        } catch (error) {
          console.error("Error removing uploaded materials", error);
        }
        return {
          success: false as const,
          error: getUserErrorMessage(error),
        };
      }
    }
}   