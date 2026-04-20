"use client";
import { EmptyState } from "@/components/states";
import { useUserProfile } from "../../hooks";
import { Button } from "@/components/ui";
import { ChevronUp, Notebook } from "lucide-react";
import { FilePreviewer, ProfileButton } from "@/components/shared";
import { useNotebooksByUserId } from "@/features/notebook/presentation/hooks";
import { useState } from "react";
import { NotebookForDetail, NotebookMaterial } from "@/features/notebook/infrastructure/queries";
import { useModal } from "@/app/providers";
import { PROFILE_MODAL_TYPES } from "../modals";
import { useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/presentation/hooks";
import { Q, RIGHT_MODES } from "@/app/(app)/home/_providers/HomeNavigationProvider";

type ProfileColumnProps = {
  userId: string;
}

export function ProfileColumn({ userId }: ProfileColumnProps) {
  const { data: profile } = useUserProfile(userId);
  const {data: notebooks = []} = useNotebooksByUserId(userId);
  const [activeTab, setActiveTab] = useState<"mine" | "others">("mine");
  const {openModal, closeModal} = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleTabClick = (tab: "mine" | "others") => {
    setActiveTab(tab);
  };
  const { signOut, isLoading: isSigningOut } = useAuth();

  const handleEditProfileClick = () => {
    openModal(PROFILE_MODAL_TYPES.UPDATE, {
      profile: profile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });
  };
  const handleMaterialClick = (material: NotebookMaterial) => {
    const notebook = notebooks.find(d => d.id === material.notebookId);
    if(!notebook) return;
    router.push(`/home?${Q.rightMode}=${RIGHT_MODES.notebook}&${Q.desk}=${notebook.deskId}&${Q.notebook}=${material.notebookId}&${Q.materialIndex}=${notebook.materials.findIndex(m => m.id === material.id)}`);
  };
  if (!profile) {
    return <EmptyState message="This User's profile does not exist." />
  }
  const stats = {
    notebooks: profile.notebooks.length || 0,
    votes: notebooks.reduce(
      (acc, item) =>
        acc +
        item.votes.reduce((voteAcc, v) => voteAcc + (v.isUpvote ? 1 : -1), 0),
      0
    ),
    desks:  profile.createdDesks?.length || 0,
  };
  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
     
      {/* Profile Info Section */}
      <div className="flex flex-col w-full px-4 pt-6 pb-4 gap-6">
          
          
        <div className="flex w-full bg-secondary-foreground shadow-sm px-7 py-4 rounded-lg border justify-between items-center max-w-sm mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{stats.notebooks}</span>
            <span className="text-xs text-muted-foreground font-medium">Notebooks</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{stats.votes}</span>
            <span className="text-xs text-muted-foreground font-medium">Votes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold">{stats.desks}</span>
            <span className="text-xs text-muted-foreground font-medium">Desks</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ProfileButton size="icon-lg" profile={profile} />

          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold">{profile.displayName}
              {" "}
              <span className="text-sm text-muted-foreground">@{profile.username}</span>
            </h2>


            {profile.school && (
              <p className="text-sm text-muted-foreground">{profile.school.name}</p>
            )}
          </div>
        </div>
          
      <div className="flex gap-2">
        <Button 
          onClick={handleEditProfileClick} 
          className="flex-1 font-semibold" 
          variant="secondary"
          size="sm"
        >
          Edit Profile
        </Button>
        <Button  
          onClick={signOut} 
          className="flex-1 font-semibold" 
          variant="tertiary"
          disabled={isSigningOut}
          size="sm"
        >
        Sign Out
        </Button>
      </div>
    </div>

      
    <div className="flex gap-1 px-3 items-center w-full bg-muted py-3.5">
      <Notebook size={18}/>
      <h2 className="text-lg font-bold">Notebooks</h2>
    </div>
    {/* Grid Tabs */}
    <div className="flex gap-2 items-center justify-around border-t border-b">
      <button className={`flex-1 flex justify-center py-3 ${activeTab === "mine" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}`} onClick={() => handleTabClick("mine")}>
        Mine
      </button>
      <button className={`flex-1 flex justify-center py-3 ${activeTab === "others" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground transition-colors"}`} onClick={() => handleTabClick("others")}>
        Others&apos;
      </button>
      
       
    </div>

      {/* Grid Section */}
      {activeTab === "mine" && <NotebookGrid onMaterialClick={handleMaterialClick} notebooks={notebooks} emptyText="You haven't posted any materials yet." /> }
      {activeTab === "others" && <NotebookGrid onMaterialClick={handleMaterialClick} notebooks={notebooks.filter(d => d.creatorId !== profile.userId)} emptyText="You haven't saved anyone else's notebooks yet." />}
     
    </div>
  );
}
type NotebookGridProps = {
  notebooks: NotebookForDetail[];
  emptyText: string;
  onMaterialClick: (material: NotebookMaterial) => void;
}
function NotebookGrid({onMaterialClick, notebooks, emptyText}: NotebookGridProps) {
  const materials = notebooks.flatMap(d => d.materials).filter(m => m.url);
  if (materials.length === 0) {
    return <EmptyState variant="item" message={emptyText} />
  }

  return (
    <div className="relative flex min-h-0 flex-1 h-full flex-col overflow-y-auto p-3">
      <div className="grid grid-cols-3 gap-1">
      {materials.map((m) => (
        <button 
          key={m.id} 
          
          className="aspect-square bg-muted flex items-center justify-center relative group overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onMaterialClick(m)}
        >
          {/* Placeholder for actual item image/preview */}
          <FilePreviewer
              enableExpand={false}
              className="size-full flex-1 absolute"
              materials={[m]}
            />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
            <div className="flex items-center gap-1">
              <ChevronUp strokeWidth={3} className="size-4 text-white" />
              <span className="text-xs font-bold">
                {
                  notebooks.find(d => d.materials.some(mat => mat.id === m.id))?.votes.filter(v => v.isUpvote).length ?? 0
                }
              </span>
        
            </div>
          </div>
        </button>
      ))}
     
    </div>
    {notebooks.length >= 3 && (
          <div className="p-4 flex justify-center pb-8">
            <Button variant="outline" className="w-full max-w-xs rounded-full font-semibold">
              View all items
            </Button>
          </div>
        )}
  </div>
  
  )
}