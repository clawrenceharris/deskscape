import { EmptyState } from "@/components/states";
import { Column, ColumnProps } from "../columns/Column";

export function DeskHomeView({ ...props }: ColumnProps) {
  return (
    <Column
      title="Home"
      contentContainerClassName="h-full overflow-y-auto"
      {...props}
    >
      <div className="centered">
        <EmptyState
          title="Home"
          message="This is the home view"
        />
      </div>
    </Column>    
  );
}