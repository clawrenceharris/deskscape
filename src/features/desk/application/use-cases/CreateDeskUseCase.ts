import { getUserErrorMessage } from "@/lib/utils/errors";
import { DeskRepository } from "../../domain/repositories";
import { DeskStorage } from "../../domain/services";
import { CreateDeskInput } from "../dto";
import { CreateDeskResult } from "../dto/CreateDeskResult";

export class CreateDeskUseCase {
  constructor(private readonly deskRepository: DeskRepository, private readonly storage: DeskStorage) {}

  async execute(input: CreateDeskInput): Promise<CreateDeskResult> {
    const { name, schoolId, imageFile, isPublic, creatorId } = input;
    let uploadedImage: { path: string; url: string | null } | null = null;
  
      try {
        
        const desk = await this.deskRepository.create({
          creatorId,
          name,
          schoolId,
          imageUrl:  null,
          imagePath: null,
          isPublic: isPublic ?? true,
          description: null,
        });

        if (imageFile) {
          uploadedImage = await this.storage.uploadImage({
            deskId: desk.id,
            file: imageFile,
            userId: creatorId,
          });
        }
        await this.deskRepository.updateDesk(desk.id,{
          imageUrl: uploadedImage?.url ?? null,
          imagePath: uploadedImage?.path ?? null,
        });
        return { success: true as const, desk };
        
      } catch (error) {
        if (uploadedImage?.path) {
          try {
            await this.storage.remove(uploadedImage.path);
          } catch(error) {
            console.error("Error removing avatar", error);
          }
        }
        console.log("error", error);
        return { success: false as const, error: getUserErrorMessage(error) };
        
      }
  }
}   