"use server"
import { CreateProfileFormValues, UserProfileDto } from "@/types/profile";
import { createProfileSchema } from "@/lib/validation";
import {  getUserErrorMessage, NotFoundError } from "@/lib/utils/errors";
import { makeCreateOrUpdateProfileUseCase } from "@/composition/profile";
type CreateOrUpdateProfileActionResult =
  | { success: true, data: UserProfileDto }
  | { success: false; error: { message: string } };


export async function createOrUpdateProfile(userId: string, data: CreateProfileFormValues): Promise<CreateOrUpdateProfileActionResult> {
    const { success, error } = createProfileSchema.safeParse(data);
    if (!success) {
        return { success: false, error: {message: error.issues[0].message} };
    }
  if(!userId){
    throw new NotFoundError("User not found");
  }
    try {
      const { displayName, username, avatarFile,  } = data;
        
      const createProfileUseCase = await makeCreateOrUpdateProfileUseCase();
      const {profile} = await createProfileUseCase.execute({userId, username, displayName: displayName ?? null, avatarFile});
      if (!profile) {
        throw new NotFoundError("Could not create profile. Please try again later.");
      }
      return { success: true as const, data: {
        userId: profile.userId,
        username: profile.username,
        displayName: profile.displayName ?? null,
        avatarUrl: profile.avatarUrl,
        avatarPath: profile.avatarPath,
      } as UserProfileDto };

    } catch (error) {      
      console.log("error", error);
      
      return { success: false as const, error: {message: getUserErrorMessage(error)} };
    }
}