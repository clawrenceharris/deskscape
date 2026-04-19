import { DialogContent } from "@/components/ui";
import { UpdateProfileForm } from "../forms";
import { UpdateProfileModalProps } from "@/lib/modals";

export function UpdateProfileModal({profile, onCancel, onSuccess} : UpdateProfileModalProps) {
  return (
    <DialogContent
      title="Update Profile"
      description="Update your profile to personalize your experience and let others find you."
      showsDescription={false}
    >
      <UpdateProfileForm profile={profile} onCancel={onCancel} onSuccess={onSuccess} />
    </DialogContent>
  );
}