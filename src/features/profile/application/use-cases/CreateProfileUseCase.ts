import { ProfileRepository } from "../../domain/repositories";
import { AvatarStorage } from "../../domain/services";
import { ApplicationError, getUserErrorMessage } from "@/lib/utils/errors";
import { CreateProfileInput } from "../dto";
import { SchoolRepository } from "@/features/school/domain/repositories";
import { ApplicationResultWithData } from "@/shared/kernel/Result";
import { ProfileForDetail } from "../../infrastructure/queries";
import { DeskRepository } from "@/features/desk/domain/repositories";

export class CreateProfileUseCase {
    constructor(
      private readonly profileRepository: ProfileRepository,
      private readonly storage: AvatarStorage,
      private readonly schoolRepository: SchoolRepository,
      private readonly deskRepository: DeskRepository
    ) {}
  
    async execute(input: CreateProfileInput): Promise<ApplicationResultWithData<ProfileForDetail>> {
      const { userId, username, displayName, avatarFile , schoolId } = input;
      let uploadedAvatar: { path: string; url: string | null } | null = null;
  
      try {
        // upload avatar
        if (avatarFile) {
          uploadedAvatar = await this.storage.upload({
            userId,
            file: avatarFile,
          });
        }

        // resolve school id
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

        



        // create profile
        const profile = await this.profileRepository.upsert({
          userId: userId,
          username: username,
          schoolId: resolvedSchoolId,
          displayName: displayName ?? null,
          avatarUrl: uploadedAvatar?.url ?? null,
          avatarPath: uploadedAvatar?.path ?? null,
        });

        // join school desk
        if(resolvedSchoolId){
          const schoolDesk = await this.deskRepository.getSchoolDesk(resolvedSchoolId);
          if(schoolDesk){
            await this.deskRepository.join({
              deskId: schoolDesk.desk.id,
              userId: userId,
              role: "CONTRIBUTOR"
            });
          }
        }
        return { success: true as const, data: profile };
      } catch (error) {
        console.error("Error creating or updating profile", error);
        if (uploadedAvatar?.path) {
          try {
            await this.storage.remove(uploadedAvatar.path);
          } catch(error) {
            console.error("Error removing avatar", error);
          }
        }
        return { success: false as const, error: new ApplicationError(getUserErrorMessage(error)) };
        
      }
  }
}