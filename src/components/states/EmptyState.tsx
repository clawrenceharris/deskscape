import React from "react";
import { cn } from "@/lib/utils";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui";
import Image from "next/image";
import { Loader2 } from "lucide-react";

/**
 * Available variants for empty state display
 */
export type EmptyVariant = "default" | "card" | "page" | "item";

export interface EmptyStateProps {
  /** The display variant - affects layout and styling */
  variant?: EmptyVariant;
  title?: string;
  message?: string;
  /** Custom icon to display (overrides default) */
  icon?: React.ReactNode;
  /** Text for the primary action button */
  actionLabel?: string;
  /** Callback for the primary action */
  onAction?: () => void;
  /** Text for the secondary action button */
  secondaryActionLabel?: string;
  /** Callback for the secondary action */
  onSecondaryAction?: () => void;
  /** Additional CSS classes to apply */
  className?: string;
  buttonIcon?: React.ReactNode; 
  buttonVariant?: "default" | "primary" | "outline" | "secondary" | "ghost" | "destructive" | "link" | "tertiary";
  secondaryButtonVariant?: "default" | "primary" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  itemVariant?: "default" | "outline" | "muted";
  imageUrl?: string;
  isLoadingAction?: boolean;
  isLoadingSecondaryAction?: boolean;
}

export function EmptyState({
  variant = "default",
  title = "Nothing to see here...",
  message: message = "There are no items to display at the moment.",
  icon,
  itemVariant = "default",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  buttonVariant = "primary",
  secondaryButtonVariant = "outline",
  buttonIcon,
  imageUrl,
  isLoadingAction,
  isLoadingSecondaryAction,
  }: EmptyStateProps) {
  const renderActions = () => {
    if (!onAction && !onSecondaryAction) return null;

    return (
      <>
       
        {onSecondaryAction && secondaryActionLabel && (
          <Button 
            className="flex-1" 
            onClick={onSecondaryAction} 
            variant={secondaryButtonVariant} 
            disabled={isLoadingSecondaryAction}
          >
            {isLoadingSecondaryAction ? <Loader2 className="w-4 h-4 animate-spin" /> : secondaryActionLabel}
          </Button>
        )}
         {onAction && actionLabel && (
            <Button  className="flex-1" variant={buttonVariant} onClick={onAction} disabled={isLoadingAction}>
              { isLoadingAction ? (<Loader2 className="w-4 h-4 animate-spin" />)
              : (<>{buttonIcon}{actionLabel}</>)}
            </Button>
        )}
      </>
    );
  };
  const renderPage = () => (
    <div className="flex-1 h-full flex justify-center gradient-background w-full items-center">
      {renderCard()}
    </div>
  );
  const renderItem = () => (
    <Item
      variant={itemVariant}
      className={cn("max-w-md w-full mx-auto", className)}
    >
      {icon && <ItemMedia>{icon}</ItemMedia>}
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {message && <ItemDescription>{message}</ItemDescription>}
      </ItemContent>
      <ItemActions>
        {renderActions()}
      </ItemActions>
    </Item>
  );

  const renderCard = () => (
    <Card
      className={cn(
        "shadow-sm border border-primary-foreground max-w-sm w-full bg-muted-background  flex flex-col justify-center text-center",
        className,
      )}
    >
      <CardHeader>
        <Image
          width={510}
          height={510}
          className="w-full max-w-[200px] mx-auto"
          alt="Sad Notebook"
          loading="eager"
          src={imageUrl ? imageUrl : "/images/error.png"}
        />
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {message && <CardDescription>{message}</CardDescription>}
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        {renderActions()}
      </CardFooter>
    </Card>
  );

  const renderDefault = () => (
    <div className={cn("flex flex-col text-center", className)}>
      <div>
        {icon && <div className="mb-3">{icon}</div>}
        <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
        {message && (
          <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
        )}
        
      </div>
      <div className="flex justify-center">{renderActions()}</div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "card":
        return renderCard();
      case "page":
        return renderPage();

      case "item":
        return renderItem();
      case "default":
      default:
        return renderDefault();
    }
  };

  return renderVariant();
}
