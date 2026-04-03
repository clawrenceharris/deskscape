import { makeGetCurrentUserUseCase } from "@/composition/auth";
import { makeGetUserProfileUseCase } from "@/composition/profile";
import { UserProfile } from "../domain/entities";

export async function getCurrentProfile(): Promise<UserProfile | null> {
    try {
    const getCurrentUserUseCase = await makeGetCurrentUserUseCase();
    const user = await getCurrentUserUseCase.execute();
    if (!user) {
        return null;
    }
    const getProfileUseCase = await makeGetUserProfileUseCase();
    const profile = await getProfileUseCase.execute(user.id);
        return profile;
    } catch (error) {
        console.error("error", error);
        return null;
    }
   }