import { Button } from "@/components/ui";
import { DeskForCard } from "@/features/desk/infrastructure/queries";
import { cn } from "@/lib/utils";

interface DeskItemMinimalProps {
    onClick?: (desk: DeskForCard) => void;
    desk: DeskForCard;
    selected?: boolean;
  }
  
export function DeskItemMinimal({desk, onClick, selected}: DeskItemMinimalProps) {
  return (
    <Button aria-label={`Open ${desk.name}`} onClick={() => onClick?.(desk)} className={cn("flex items-center text-center rounded-lg size-15 bg-muted justify-center hover:bg-muted/80" , selected ? "border-primary border-2 bg-primary/20" : "")}>
      <span className="uppercase">
        {(() => {
          const words = desk.name
            .trim()
            .split(/\s+/)
            .filter(w => w.length > 0)
            .flatMap(w => w.split('-').filter(Boolean));

          if (words.length === 0) return "";
          if (words.length === 1) {
            return words[0][0] || "";
          }

          const first = words[0][0] || "";
          let middle = "";
          if (words.length > 2) {
            // Use first letter of the first middle word (excluding first and last)
            middle = (words[1][0] || "");
          }
          const last = words[words.length - 1][0] || "";

          return first + (middle ? middle : "") + last;
        })()}

      </span>

    </Button>
  )
}