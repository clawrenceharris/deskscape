import { EmptyState } from "@/components/states";
import { Column, ColumnProps } from "../columns";

  export function ComingSoonView({ ...props }: ColumnProps) {
  return (
    <Column 
      title="Coming Soon" 
      contentContainerClassName="h-full overflow-y-auto" 
      {...props}
    >
      <div className="centered">
        <EmptyState
          title="Coming Soon"
          message="This feature is not available yet. Please check back later."
          buttonVariant="primary"
          onAction={() => {}}
          actionLabel="Check back later"
        />  
      </div>
    </Column>
  );
}