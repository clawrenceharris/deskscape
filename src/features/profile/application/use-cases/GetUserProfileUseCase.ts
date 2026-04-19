import { getUserErrorMessage } from "@/lib/utils/errors";
import { UserProfileRepository } from "../../domain/repositories";
import { GetUserProfileResult } from "../dto";

/**
 * Get the profile of a user by their user ID
 * @param userId - The ID of the user to get the profile of
 * @returns The profile of the user
 */
export class GetUserProfileUseCase {
    constructor(private readonly userProfileRepository: UserProfileRepository) {}

    async execute(userId: string): Promise<GetUserProfileResult> {
        try {
            const profile = await this.userProfileRepository.getProfileByUserId(userId);
            return { success: true, data: profile };
        } catch (error) {
            return { success: false, error: getUserErrorMessage(error) };
        }
    }
}