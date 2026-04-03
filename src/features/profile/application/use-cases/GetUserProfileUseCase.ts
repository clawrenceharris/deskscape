import { UserProfile } from "../../domain/entities";
import { UserProfileRepository } from "../../domain/repositories";

export class GetUserProfileUseCase {
    constructor(private readonly userProfileRepository: UserProfileRepository) {}

    async execute(userId: string): Promise<UserProfile | null> {
        const profile = await this.userProfileRepository.getProfileByUserId(userId);
        return profile ?? null;
    }
}