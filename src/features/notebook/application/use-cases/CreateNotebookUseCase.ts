import { DeskStorage } from "@/features/desk/domain/services";
import { NotebookRepository } from "../../domain/repositories";
import type { CreateNotebookInput } from "../dto";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { ApplicationError, ApplicationResultWithData } from "@/shared/kernel";
import { NotebookForDetail } from "../../infrastructure/queries";


export class CreateNotebookUseCase {
    constructor(private readonly repository: NotebookRepository, private readonly storage: DeskStorage) {}
    async execute(input: CreateNotebookInput): Promise<ApplicationResultWithData<NotebookForDetail>> {
        let uploads: { path: string; url: string }[] = [];
      try {
        //1. Get creator id from session
        const user = await getCurrentUser();
        if (!user) {
          return {
            success: false as const,
            error: new ApplicationError("User not found"),
          };
        }
        // 1. Upload files
        const uploadedMaterials = await Promise.all(
          input.data.materials.map(async (m) => {
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
              title: m.file.name,
              mimeType: m.file.type,
              authorId: user.id,
            };
          })
        );
        uploads = uploadedMaterials.map((u) => ({ path: u.path, url: u.url }));
        // 2. Save to DB
        const notebook = await this.repository.create({
          deskId: input.deskId,
          creatorId: user.id,
          title: input.data.title,
          description: input.data.description ?? null,
          materials: uploadedMaterials.map((u) => ({
            type: u.type ?? "OTHER",
            url: u.url,
            path: u.path,
            title: u.title,
            mimeType: u.mimeType,
            authorId: u.authorId,
          })),
        });
    
        return {
          success: true as const,
          data: notebook,
        };
      } catch (error) {
        console.error("Error creating notebook", error);
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
          error: new ApplicationError(getUserErrorMessage(error)),
        };
      }
    }
}   