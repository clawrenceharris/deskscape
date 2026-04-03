import { UserProfileRepository } from "../../domain/repositories";
import { AvatarStorage } from "../../domain/services";
import { UserProfile } from "../../domain/entities";
export class CreateOrUpdateProfileUseCase {
    constructor(
      private readonly profileRepository: UserProfileRepository,
      private readonly avatarStorage: AvatarStorage
    ) {}
  
    async execute(input: {
      userId: string;
      username: string;
      displayName?: string | null;
      avatarFile?: File | null;
    }) {
      let uploadedAvatar: { path: string; url: string | null } | null = null;
  
      try {
        if (input.avatarFile) {
          uploadedAvatar = await this.avatarStorage.upload({
            userId: input.userId,
            file: input.avatarFile,
          });
        }
  
        const profile = await this.profileRepository.upsert(new UserProfile({
          userId: input.userId,
          username: input.username,
          displayName: input.displayName ?? null,
          avatarUrl: uploadedAvatar?.url ?? null,
          avatarPath: uploadedAvatar?.path ?? null,
        }));
  console.log("profile", profile);
        return {
          success: true as const,
          profile,
        };
      } catch (error) {
        console.error("error", error);
        if (uploadedAvatar?.path) {
          try {
            await this.avatarStorage.remove(uploadedAvatar.path);
          } catch {
            // log cleanup failure
          }
        }
  
        return {
          success: false as const,
          error:
            error instanceof Error
              ? error.message
              : "Could not complete profile setup.",
        };
      }
    }
  }