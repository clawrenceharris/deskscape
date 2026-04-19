import { UserProfileRepository } from "../../domain/repositories";
import { GetUserProfileInput, GetUserProfileResult } from "../dto";
import { getUserErrorMessage } from "@/lib/utils/errors";

export class GetCurrentProfileUseCase {
    constructor(private readonly userProfileRepository: UserProfileRepository) {}

    async execute({userId} : GetUserProfileInput): Promise<GetUserProfileResult> {
        try {
            const profile =  await this.userProfileRepository.getProfileByUserId(userId);
            return {success: true, data: profile}
        } catch (error) {
            console.error(error);
            return { success: false, error: getUserErrorMessage(error) };
        }
    }
}