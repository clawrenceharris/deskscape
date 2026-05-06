
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { useMemo } from "react";

interface DeskHeaderProps {
  notebooks: NotebookForDetail[];
}

export function DeskHeader({notebooks}: DeskHeaderProps) {
  const downloadCount = useMemo(() =>{
    return notebooks.reduce((acc, item) => item.downloads.length + acc, 0)
  },[notebooks]);
  const voteCount = useMemo(() =>{
    return notebooks.reduce((acc, item) => {
      const upvotes = item.votes.filter(v => v.isUpvote);
      const downvotes = item.votes.filter(v => !v.isUpvote);
      return (upvotes.length - downvotes.length) + acc;
    } ,0)
  },[notebooks])
  return (
    <div role="header" className="column-header justify-between -top-30 bg-surface">
     
        <div className="flex flex-1 justify-between w-full">
          <div
            style={{
              flex: 1,

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3 data-testid="uploads-count">{notebooks.length || 0}</h3>

            <p className="text-muted-foreground">Uploads</p>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3 data-testid="downloads-count">{downloadCount}</h3>
            <p className="text-muted-foreground">Downloads</p>
          </div>
          <div
            style={{
              flex: 1,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3 data-testid="votes-count">{voteCount}</h3>

            <p className="text-muted-foreground">Votes</p>
          </div>
        </div>

    </div>
  );
};

