import { DeskRepository } from "../../domain/repositories";
import { ApplicationError, ApplicationResultWithData } from "@/shared/kernel";
import { DeskForDetail } from "../../infrastructure/queries";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ProfileRepository } from "@/features/profile/domain/repositories";

export class CreateMyDeskUseCase {
    constructor(private readonly deskRepository: DeskRepository, private readonly profileRepository: ProfileRepository) {}

    async execute(profileId: string): Promise<ApplicationResultWithData<DeskForDetail>> {
       try{
            const profile = await this.profileRepository.getByUserId(profileId);
            if(!profile){
                return { success: false as const, error: new ApplicationError("Profile not found") };
            }
            const desk = await this.deskRepository.createMyDesk(profile);
            return { success: true as const, data: desk };
        } catch (error) {
            return { success: false as const, error: new ApplicationError(getUserErrorMessage(error)) };
        }
    }
}