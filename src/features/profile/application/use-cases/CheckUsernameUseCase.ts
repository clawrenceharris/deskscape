import { ConflictError } from "@/lib/utils/errors";
import { UserProfileRepository } from "../../domain/repositories";

export class CheckUsernameUseCase {
    constructor(private readonly userProfileRepository: UserProfileRepository) {}

    async execute(username: string): Promise<boolean> {
        const exists = await this.userProfileRepository.existsByUsername(username);
        if(exists) {
            throw new ConflictError("Username already exists");
        }
        return true;
    }
}