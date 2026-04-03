import { UserProfile } from "../../domain/entities";

export class CreateProfileDto {
    constructor(
        public readonly name: string | null,
        public readonly username: string,
        public readonly avatarUrl: string | null,
        public readonly avatarPath: string | null,
        public readonly userId: string,
    ) {}
    static create(name: string | null, username: string, avatarUrl: string | null, avatarPath: string | null, userId: string): CreateProfileDto {
        return new CreateProfileDto(name, username, avatarUrl, avatarPath, userId);
    }
    toDomain(): UserProfile {
            return new UserProfile({
                userId: this.userId,
                displayName: this.name,
                username: this.username,
                avatarUrl: this.avatarUrl,
                avatarPath: this.avatarPath,
            });
        }
}