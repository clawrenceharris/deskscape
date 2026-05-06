"use client";
import { EmptyState } from "@/components/states";
import { Column, type ColumnProps } from "../columns";
import { DeskForDetail } from "@/features/desk/infrastructure/queries";
interface ChalkboardViewProps extends ColumnProps {
  desk: DeskForDetail;

}
export function ChalkboardView({ ...props }: ChalkboardViewProps) {
  const chalkboards = [];
  
  return (
    <Column
      title="Chalkboards"
      contentContainerClassName="h-full overflow-y-auto"
      {...props}
    >
      {chalkboards.length === 0 && (
        <div className="centered">
          <EmptyState
            title="No chalkboards yet"
            message="This desk doesn't have any chalkboards yet. Check back later or add something yourself!"
            buttonVariant="primary"
            onAction={() => {}}
            actionLabel="Create chalkboard"
          /> 
        </div>
      )}
    </Column>
  );
}