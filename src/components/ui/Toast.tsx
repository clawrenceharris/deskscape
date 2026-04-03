import { ReactNode } from "react";
import {
  Item,
  Button,
  ItemTitle,
  ItemContent,
  ItemDescription,
  ItemActions,
  ItemMedia,
  type ButtonProps
} from "./";
import { BadgeCheck, CircleAlert, Info, TriangleAlert } from "lucide-react";

interface CustomToastProps {
  action?: { label: string; onClick: () => void };
  icon?: ReactNode;
  type?: "error" | "success" | "info" | "warning";
  data: { title: string; text?: string };
  buttonProps: ButtonProps;
}
export const CustomToast = ({
  data,
  action,
  type = "info",
  buttonProps,
  ...props
}: CustomToastProps) => {
  const getIcon = () => {
    switch (type) {
      case "info":
        return <Info className="stroke-indigo-400" />;
      case "error":
        return <CircleAlert className="stroke-red-500" />;
      case "success":
        return <BadgeCheck className="stroke-green-500" />;
      case "warning":
        return <TriangleAlert className="stroke-yellow-500" />;
      default:
        return null;
    }
  };
  const icon = props.icon || getIcon();

  return (
    <Item className="flex w-full justify-between gap-3">
      {icon && <ItemMedia>{icon || getIcon()}</ItemMedia>}
      <ItemContent>
        <ItemTitle>{data.title}</ItemTitle>

        {data.text && <ItemDescription>{data.text}</ItemDescription>}
      </ItemContent>
      {action && (
        <ItemActions>
          <Button onClick={action.onClick} {...buttonProps}>
            {action.label}
          </Button>
        </ItemActions>
      )}
    </Item>
  );
};