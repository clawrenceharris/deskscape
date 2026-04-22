"use client";
import { useMemo } from "react";
import { useDeskContext, useLayout, useUser } from "@/app/providers";
import {
  ChevronDown,
  ChevronUp,
  Download,
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
import { useDeleteNotebook, useNotebook, useMakeVote, useVotes } from "../../hooks";
import { AnimatedVoteCount } from "../ui";
import { EmptyState, LoadingState } from "@/components/states";
import { useDownloadNotebook } from "../../hooks";
import { NOTEBOOK_MODAL_TYPES } from "../modals";
import { useModals } from "@/hooks/useModals";

interface NotebookColumnProps {
  onProfileClick: (profileId: string) => void;
  notebookId: string | null;
  materialIndex: number;
  onMaterialIndexChange: (index: number) => void;
}

export function NotebookColumn({
  onProfileClick,
  notebookId,
  materialIndex,
  onMaterialIndexChange,
}: NotebookColumnProps) {
  const { user } = useUser();
  const { modals: { "notebook:update": updateNotebookModal }} = useModals();
  const {data: notebook = null, isLoading: notebookLoading} = useNotebook(notebookId);
  const { makeVote, removeVote} = useMakeVote();
  const { setCurrentNotebookId } = useDeskContext();
  const {closeRightLayout} = useLayout();
  const { data: votes = [] } = useVotes(notebook?.id ?? null);


  const { download: downloadNotebook } = useDownloadNotebook();
  const { deleteNotebook } = useDeleteNotebook();
  const { download, downloading } = useDownload();



  const isUpvoted = useMemo(() => {
    const v = votes.find((vote) => vote.userId === user.id)?.isUpvote;
    if (v === undefined) return null;
    return v;
  }, [votes, user.id]);


  
  const handleDownload = async () => {
    if (!notebook || downloading) return;
    try {
      await download(notebook.materials.map((material) => material.url) ?? []);
      if(notebook.downloads.some((download) => download.profile?.userId === user.id)) {
        return;
      }
      await downloadNotebook({notebookId: notebook.id, userId: user.id, deskId: notebook.deskId});
    } catch (error) {
      toast.error(getUserErrorMessage(error));
    }
  };
  const handleUpVote = () => {
    if (!notebook) return;

    if(isUpvoted === true){
      removeVote({notebookId: notebook.id, deskId: notebook.deskId});
    } else{
      makeVote({notebookId: notebook.id, deskId: notebook.deskId, isUpvote: true});
    }
  };
  const handleDownVote = () => {
    if (!notebook) return;
    if(isUpvoted ?? true){
      makeVote({notebookId: notebook.id, deskId: notebook.deskId, isUpvote: false});
    } else if(isUpvoted === false){
      removeVote({notebookId: notebook.id, deskId: notebook.deskId});
    }
  };

  const handleDelete = () => {
    if (!notebook) return;
    deleteNotebook({notebookId: notebook.id, deskId: notebook.deskId});
    setCurrentNotebookId(null);
    closeRightLayout();
  };
  const handleEdit = () => {
    if (!notebook) return;
    updateNotebookModal.open(notebook.id);
  };
  const voteCount = useMemo(() => {
    return votes.reduce((acc, vote) => {
      if(vote.isUpvote) return acc + 1;
      return acc - 1;
    }, 0) ?? 0;
  }, [votes]);



  if (notebookLoading) {
    return (
      <div className="flex flex-col flex-1">
        <LoadingState />
      </div>
    );
  }
  if (!notebook) {
    return (
      <div className="flex flex-col flex-1">
        <EmptyState variant="page" title="Not Found" message="This Notebook does not exist or has been deleted." />
      </div>
    );
  }
 
  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="column-header sticky pl-8">
        <ProfileButton
          profile={notebook.creator}
          showsName
          onClick={() => onProfileClick(notebook.creator.userId)}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm bg-primary text-white font-semibold flex items-center gap-1 rounded-full px-4 py-2">
           <Download strokeWidth={3} size={17} /> {notebook.downloads.length}
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
          {user.id === notebook.creator.userId && (
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil />
              Edit
            </DropdownMenuItem>
          )}
          {user.id === notebook.creator.userId && (
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
        <div className="relative mx-auto max-w-lg w-full overflow-hidden rounded-xl">
          <div className="relative mx-auto aspect-square h-auto object-contain w-full">
            <FilePreviewer
              onDownloadClick={handleDownload}
              materials={notebook.materials}
              materialIndex={materialIndex}
              onMaterialIndexChange={onMaterialIndexChange}
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
          
          {/* Overlay for interactions */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between pointer-events-none">
            <div className="w-full shadow-md max-w-xs bg-white rounded-full p-2 flex absolute bottom-3 left-1/2 -translate-x-1/2 items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2 border border-zinc-300 rounded-full">
                <div className="flex items-center gap-1">
                  <Button
                    disabled={notebook.materials.length === 0}
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
                    disabled={notebook.materials.length === 0}
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
                disabled={downloading || notebook.materials.length === 0}
                variant="tertiary"
                className="hover:bg-black/70 bg-black text-white"
                onClick={handleDownload}
              >
                <Download strokeWidth={3} /> Download
              </Button>
            </div>
          </div>
        </div>
         
        {notebook.description && 
        <div className="bg-secondary-foreground p-4 rounded-lg border mt-6 line-clamp-4">
          <p className="text-sm text-muted-foreground">{notebook.description}</p>
        </div>}
      </div>
      
    </div>
  );
}