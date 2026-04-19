"use client";
import { useMemo, useState } from "react";
import { useModal, useUser } from "@/app/providers";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Maximize,
  MoreVertical,
  Pencil,
  Share,
  Trash2,

} from "lucide-react";
import { Button, DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui";
import { FilePreviewer, ProfileButton } from "@/components/shared";
import { useDownload } from "@/hooks";
import { toast } from "sonner";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { useDeleteDeskItem, useDeskItem, useMakeVote, useVotes } from "../../hooks";
import { AnimatedVoteCount } from "../ui";
import { EmptyState, LoadingState } from "@/components/states";
import { useDownloadDeskItem } from "../../hooks";
import { DeskItemForCard } from "@/features/deskItem/infrastructure/queries";
import { DESK_ITEM_MODAL_TYPES } from "../modals";
import { deskItemKeys } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";

interface DeskItemColumnProps {
  onProfileClick: (profileId: string | null) => void;
  deskItemId: string | null;
}

export function DeskItemColumn({
  onProfileClick,
  deskItemId,
}: DeskItemColumnProps) {
  const { user } = useUser();
  const {openModal, closeModal} = useModal();
  const queryClient = useQueryClient();
  const [ materialIndex, setMaterialIndex ] = useState(0);
  const {data: deskItem = null, isLoading: deskItemLoading} = useDeskItem(deskItemId);
  const { makeVote, removeVote} = useMakeVote();
    
  const { data: votes = [] } = useVotes(deskItem?.id ?? null);
  const isUpvoted = useMemo(() => {
    
    const v = votes.find((vote) => vote.userId === user.id)?.isUpvote;
    if (v === undefined) return null;
    return v;
  }, [votes, user.id]);
  const { download: downloadDeskItem } = useDownloadDeskItem();

  const goPrevMaterial = () => {
    if (!deskItem) return;
    if (deskItem.materials.length <= 0) return;
    setMaterialIndex((i) => (i <= 0 ? deskItem.materials.length - 1 : i - 1));
  };
  const goNextMaterial = () => {
    if(!deskItem) return;
    if (deskItem.materials.length <= 0) return;
    setMaterialIndex((i) => (i >= deskItem.materials.length - 1 ? 0 : i + 1));
  };
  const {deleteDeskItem} = useDeleteDeskItem();
  const { download, downloading } = useDownload();

  const handleDownload = async () => {
    if (!deskItem || downloading) return;
    try {
      await download(deskItem.materials.map((material) => material.url) ?? []);
      if(deskItem.downloads.some((download) => download.profile?.userId === user.id)) {
        return;
      }
      await downloadDeskItem({deskItemId: deskItem.id, userId: user.id, deskId: deskItem.deskId});
    } catch (error) {
      toast.error(getUserErrorMessage(error));
    }
  };
  const handleUpVote = () => {
    if (!deskItem) return;

    if(isUpvoted === true){
      removeVote({deskItemId: deskItem.id, deskId: deskItem.deskId});
    } else{
      makeVote({deskItemId: deskItem.id, deskId: deskItem.deskId, isUpvote: true});
    }
  };
  const handleDownVote = () => {
    if (!deskItem) return;
    if(isUpvoted ?? true){
      makeVote({deskItemId: deskItem.id, deskId: deskItem.deskId, isUpvote: false});
    } else if(isUpvoted === false){
      removeVote({deskItemId: deskItem.id, deskId: deskItem.deskId});
    }
  };

  const handleDelete = () => {
    if (!deskItem) return;
    deleteDeskItem({id: deskItem.id, deskId: deskItem.deskId});
  };
  const handleEdit = () => {
    if (!deskItem) return;
    openModal(DESK_ITEM_MODAL_TYPES.UPDATE, {
      deskItemId: deskItem.id, 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: deskItemKeys.listByDeskId(deskItem.deskId) });
        queryClient.invalidateQueries({ queryKey: deskItemKeys.detail(deskItem.id) });
        closeModal();
      },
      onCancel: () => {
        closeModal();
      },
    });
  };
  const voteCount = useMemo(() => {
    return votes.reduce((acc, vote) => {
      if(vote.isUpvote) return acc + 1;
      return acc - 1;
    }, 0) ?? 0;
  }, [votes]);



  if (deskItemLoading) {
    return (
      <div className="flex flex-col flex-1">
        <LoadingState />
      </div>
    );
  }
  if (!deskItem) {
    return (
      <div className="flex flex-col flex-1">
        <EmptyState variant="page" title="Not Found" message="This Desk item does not exist or has been deleted." />
      </div>
    );
  }
 
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="column-header sticky pl-8">
        <ProfileButton
          profile={deskItem.creator}
          showsName
          onClick={() => onProfileClick(deskItem.creator.userId)}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm bg-primary text-white font-semibold flex items-center gap-1 rounded-full px-4 py-2">
           <Download strokeWidth={3} size={17} /> {deskItem.downloads.length}
          </span>

          <DropdownMenu>

         <DropdownMenuTrigger asChild> 
        <Button size="icon" variant="ghost" aria-label="More options">
          <MoreVertical />
        </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent>
          <DropdownMenuItem>
            <Share />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download />
            Download
          </DropdownMenuItem>
          {user.id === deskItem.creator.userId && (
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil />
              Edit
            </DropdownMenuItem>
          )}
          {user.id === deskItem.creator.userId && (
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          )}
         </DropdownMenuContent>
         </DropdownMenu>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 h-full flex-col overflow-y-auto p-6">
        
        { deskItem.materials.length > 0 ? (
          <div className="relative mx-auto max-w-lg w-full overflow-hidden rounded-xl">
              <div className="relative mx-auto aspect-square h-auto object-contain w-full">
                <FilePreviewer
                  onDownloadClick={handleDownload}
                  visible={true}
                  url={deskItem.materials[materialIndex].url}
                  filename={deskItem.materials[materialIndex].title ?? ""}
                />
              </div>
            {/* Gradient overlay, allowing pointer events to pass through */}
            <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))",
              }}
              aria-hidden="true"
            />
            
            {/* Overlay controls, allow interactions */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between pointer-events-none">
              <Button
                size="icon"
                variant="ghost"
                className="absolute pointer-events-auto text-white bg-black/50 hover:bg-black/30 rounded-full p-2 left-3"
                aria-label="View previous image"
                onClick={goPrevMaterial}
              >
                <ChevronLeft strokeWidth={3} />
              </Button>

              <Button
                className="absolute pointer-events-auto active:translate-y-none text-white bg-black/50 hover:bg-black/30 rounded-full p-2 right-3"
                size="icon"
                variant="ghost"
                aria-label="View next image"
                onClick={goNextMaterial}
              >
                <ChevronRight strokeWidth={3} />
              </Button>
              <Button
                className="image-control pointer-events-auto"
                size="icon"
                variant="ghost"
                aria-label="Maximize"
                onClick={() => {}}
              >
                <Maximize />
              </Button>
              <div className="w-full shadow-md max-w-xs bg-white rounded-full p-2 flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 border border-zinc-300 rounded-full">
                  <div className="flex items-center gap-1">
                    <Button
                      disabled={deskItem.materials.length === 0}
                      size="icon-lg"
                      variant="ghost"
                      aria-label="Downvote"
                      className={`hover:bg-zinc-300/50! ${isUpvoted === false ? "text-primary" : "text-black"}`}
                      onClick={handleDownVote}>
                      <ChevronDown strokeWidth={3}/>
                    </Button>
                    <p className="text-sm font-medium tabular-nums">
                      <AnimatedVoteCount className="text-black" value={voteCount} zeroLabel="Vote" />
                    </p>
                    <Button
                      disabled={deskItem.materials.length === 0}
                      size="icon-lg"
                      variant="ghost"
                      aria-label="Upvote"
                      className={`hover:bg-zinc-300/50! ${isUpvoted === true ? "text-primary" : "text-black"}`}
                      onClick={handleUpVote}>
                      <ChevronUp strokeWidth={3}/>
                    </Button>
                  </div>  
                </div>
                <Button
                  disabled={downloading || deskItem.materials?.length === 0}
                  variant="tertiary"
                  className="hover:bg-black/70 bg-black text-white"
                  onClick={handleDownload}
                >
                  <Download strokeWidth={3} /> Download
                </Button>
              </div>
            </div>
     
          
          </div> )
          :
          ( <div className="flex-1 flex items-center justify-center">
            <EmptyState variant="card" title="No files" message="There are no files in this upload" />
          </div>
        )}
        {deskItem.description && 
        <div className="bg-secondary-foreground p-4 rounded-lg border mt-6 line-clamp-4">
          <p className="text-sm text-muted-foreground">{deskItem.description}</p>
        </div> }
      </div>
      
    </div>
  );
}


function CommentSection({deskItem}: {deskItem: DeskItemForCard}) {
  return (
    <div className="mt-6 ">
    <div className="flex items-center justify-between  mb-2">
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="flex items-center">

       
        <Button size="xs" variant="link" className="text-sm">Add Comment</Button>
        <Button size="xs" variant="link" className="text-sm text-secondary">
         View all
        </Button>
        </div>
    </div>
    <div className="flex flex-col gap-4">
      {[
        {
          id: 1,
          author: "Alice",
          content: "Great job on this desk item!",
          date: "2024-06-15"
        }
       
      ].map(comment => (
        <div key={comment.id} className="rounded-md bg-secondary-foreground border shadow-xs px-3 py-2">
          
          <div className="flex items-center p-2 space-y-1 justify-between mx-3">
          <ProfileButton
            profile={deskItem.creator}
            showsName
            size="icon-xs"
          />
            <span className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
      ))}
    </div>
  </div>
   
  );
}