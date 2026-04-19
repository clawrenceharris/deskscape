import { getUserErrorMessage } from "@/lib/utils/errors";
import { UserProfileRepository } from "../../domain/repositories";
import { CheckUsernameAvailabilityResult } from "../dto";

export class CheckUsernameAvailabilityUseCase {
    constructor(private readonly userProfileRepository: UserProfileRepository) {}

    async execute(username: string, userId: string): Promise<CheckUsernameAvailabilityResult> {
        try{
        const user = await this.userProfileRepository.getProfileByUsername(username);
        if(user && user.userId !== userId) {
            return { isAvailable: false, success: true };
        }
       
        return { isAvailable: true, success: true };
        } catch (error) {
            return { success: false, error: getUserErrorMessage(error) };
        }
    }
}