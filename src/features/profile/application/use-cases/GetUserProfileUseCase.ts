import { getUserErrorMessage } from "@/lib/utils/errors";
import { ProfileRepository } from "../../domain/repositories";
import { ApplicationResultWithData } from "@/shared/kernel";
import { ProfileForDetail } from "../../infrastructure/queries";
import { ApplicationError } from "@/lib/utils/errors";

/**
 * Get the profile of a user by their user ID
 * @param userId - The ID of the user to get the profile of
 * @returns The profile of the user
 */
export class GetUserProfileUseCase {
    constructor(private readonly userProfileRepository: ProfileRepository) {}

    async execute(userId: string): Promise<ApplicationResultWithData<ProfileForDetail | null>> {
        try {
            const profile = await this.userProfileRepository.getByUserId(userId);
            return { success: true, data: profile };
        } catch (error) {
            return { success: false, error: new ApplicationError(getUserErrorMessage(error)) };
        }
    }
}