import { getUserErrorMessage } from "@/lib/utils/errors";
import { ProfileRepository } from "../../domain/repositories";
import { CheckUsernameAvailabilityResult } from "../dto";

export class CheckUsernameAvailabilityUseCase {
    constructor(private readonly userProfileRepository: ProfileRepository) {}

    async execute(username: string, userId: string): Promise<CheckUsernameAvailabilityResult> {
        try{
        const profile = await this.userProfileRepository.getByUsername(username);
        if(profile && profile.userId !== userId) {
            return { isAvailable: false, success: true };
        }
       
        return { isAvailable: true, success: true };
        } catch (error) {
            return { success: false, error: getUserErrorMessage(error) };
        }
    }
}