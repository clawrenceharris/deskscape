
import { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";
import { useMemo } from "react";

interface DeskHeaderProps {
  deskItems: DeskItemForDetail[];
}

export function DeskHeader({deskItems}: DeskHeaderProps) {
  const downloadCount = useMemo(() =>{
    return deskItems.reduce((acc, item) => item.downloads.length + acc, 0)
  },[deskItems]);
  const voteCount = useMemo(() =>{
    return deskItems.reduce((acc, item) => {
      const upvotes = item.votes.filter(v => v.isUpvote);
      const downvotes = item.votes.filter(v => !v.isUpvote);
      return (upvotes.length - downvotes.length) + acc;
    } ,0)
  },[deskItems])
  return (
    <div role="header" className="column-header justify-between mb-7 -top-30 bg-surface">
     
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
            <h3>{deskItems.length || 0}</h3>

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
            <h3>{downloadCount}</h3>
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
            <h3>{voteCount}</h3>

            <p className="text-muted-foreground">Votes</p>
          </div>
        </div>

    </div>
  );
};

