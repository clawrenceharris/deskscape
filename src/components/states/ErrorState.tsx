"use client";
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
  ItemTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * Available variants for error display
 */
export type ErrorVariant = "item" | "card" | "page";

/**
 * Props for the ErrorState component
 */
export interface ErrorStateProps {
  /** The display variant - affects layout and styling */
  variant?: ErrorVariant;
  /** The error title/heading */
  title?: string;
  /** Detailed error message */
  message?: string | null;
  /** Callback function for retry action */
  onRetry?: () => void;
  /** Callback function for action */
  onAction?: () => void;
  /** Text for the retry button */
  retryLabel?: string;
  /** Additional CSS classes to apply */
  className?: string;
  /** Text for the action button */
  actionLabel?: string;
  /** Variant for the action button */
  buttonVariant?: "default" | "primary" | "outline" | "secondary" | "ghost" | "destructive" | "link" | "tertiary";
}

export function ErrorState({
  variant = "page",
  title = "Something went wrong.",
  message = "Sorry, something broke. Come back later and try again.",
  actionLabel,
  onAction,
  onRetry,
  retryLabel = "Try Again",
  className,
  buttonVariant = "primary",
}: ErrorStateProps) {
  const renderCard = () => (
    <Card
      className={cn(
        "m-auto max-w-md min-w-sm text-center shadow-none border-2",
        className
      )}
    >
      <CardHeader>
        <Image
          width={410}
          height={410}
          className="w-full max-w-[200px] mx-auto"
          alt="Sad Notebook"
          src="/images/error.png"
        />
      </CardHeader>
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>

      <CardContent>

        <CardDescription>{message}</CardDescription>
      </CardContent>
      <CardFooter className="gap-4">
      {onRetry && (<CardAction className="flex-1">

        
        
          <Button className="w-full" onClick={onRetry} variant="outline">
            {retryLabel}
          </Button>
        
         </CardAction>)}
         {onAction && actionLabel && (<CardAction className="flex-1">
          <Button variant={buttonVariant} className="w-full" onClick={onAction}>{actionLabel}</Button>
          </CardAction>)}
      </CardFooter>
    </Card>
  );

  const renderItem = () => (
    <Item className={className}>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {message && <ItemDescription>{message}</ItemDescription>}
        {onRetry && (
          <ItemActions>
            <Button variant="outline" onClick={onRetry}>
              {retryLabel}
            </Button>
          </ItemActions>
        )}
        {onAction && actionLabel && (
          <ItemActions>
            <Button onClick={onAction}>{actionLabel}</Button>
          </ItemActions>
        )}
      </ItemContent>
    </Item>
  );
  const renderPage = () => (
    <div className="h-screen flex justify-center gradient-background w-full items-center">
      {renderCard()}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "card":
        return renderCard();
      case "item":
        return renderItem();
      case "page":
      default:
        return renderPage();
    }
  };

  return renderVariant();
}
