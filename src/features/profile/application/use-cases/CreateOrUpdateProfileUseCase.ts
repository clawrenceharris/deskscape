import { UserProfileRepository } from "../../domain/repositories";
import { AvatarStorage } from "../../domain/services";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { CreateOrUpdateProfileInput, CreateOrUpdateProfileResult } from "../dto";
import { SchoolRepository } from "@/features/school/domain/repositories";

export class CreateOrUpdateProfileUseCase {
    constructor(
      private readonly profileRepository: UserProfileRepository,
      private readonly storage: AvatarStorage,
      private readonly schoolRepository: SchoolRepository
    ) {}
  
    async execute(input: CreateOrUpdateProfileInput): Promise<CreateOrUpdateProfileResult> {
      const { userId, username, displayName, avatarFile , schoolId } = input;
      let uploadedAvatar: { path: string; url: string | null } | null = null;
  
      try {
        const existingProfile = await this.profileRepository.getProfileByUserId(userId);

        if (avatarFile) {
          uploadedAvatar = await this.storage.upload({
            userId,
            file: avatarFile,
          });
        }
        const normalizedSchoolInput = schoolId?.trim() ?? "";
        let resolvedSchoolId: string | null = null;

        if (normalizedSchoolInput.length > 0) {
          const existingById = await this.schoolRepository.getSchoolById(normalizedSchoolInput);
          if (existingById) {
            resolvedSchoolId = existingById.id;
          } else {
            const existingByName = await this.schoolRepository.getSchools({
              where: {
                name: {
                  equals: normalizedSchoolInput,
                  mode: "insensitive",
                },
              },
            });

            if (existingByName[0]) {
              resolvedSchoolId = existingByName[0].id;
            } else {
              const newSchool = await this.schoolRepository.createSchool({
                name: normalizedSchoolInput,
                students: [],
                desks: [],
              });
              resolvedSchoolId = newSchool.id;
            }
          }
        }
  
        const profile = await this.profileRepository.upsert({
          userId: userId,
          username: username,
          schoolId: resolvedSchoolId,
          displayName: displayName ?? null,
          avatarUrl: uploadedAvatar?.url ?? existingProfile?.avatarUrl ?? null,
          avatarPath: uploadedAvatar?.path ?? existingProfile?.avatarPath ?? null,
        });
        return { success: true as const, profile };
      } catch (error) {
        console.error("Error creating or updating profile", error);
        if (uploadedAvatar?.path) {
          try {
            await this.storage.remove(uploadedAvatar.path);
          } catch(error) {
            console.error("Error removing avatar", error);
          }
        }
        return { success: false as const, error: getUserErrorMessage(error) };
        
      }
  }
}