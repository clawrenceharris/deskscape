import React, { ReactNode, useRef } from "react";
import { useLayout } from "@/app/providers";
import { motion, MotionProps } from "motion/react";
import { ColumnType } from "@/app/providers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface ColumnProps extends MotionProps {
  title?: string | ReactNode;
  openWidth?: string | number;

  closedWidth?: string | number;
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  headerRight?: React.ReactNode;
  headerBottom?: React.ReactNode;
  className?: string;
  collapsable?: boolean;
  onCollapse?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCollapseEnd?: () => void;
  onOpen?: () => void;
  columnType: ColumnType;
  headerStyle?: React.CSSProperties;
  toggle?: React.ReactNode;
  showsHeader?: boolean;
  children?: React.ReactNode;
  contentContainerClassName?: string;
}
export function Column ({
  title,
  openWidth,
  closedWidth,
  toggle,
  style,
  className,
  headerRight,
  contentContainerClassName,
  columnType,
  collapsable = true,
  onCollapse,
  onCollapseEnd,
  onOpen,
  headerStyle,
  showsHeader = true,
  children,
}: ColumnProps) {
  const { openColumn, closeColumn, isColumnOpen } = useLayout();
  const columnRef = useRef<HTMLDivElement>(null);
  const isOpen = isColumnOpen(columnType);

  const handleCloseColumn = (e: React.MouseEvent<HTMLButtonElement>) => {
    onCollapse?.(e);
    if (!e.defaultPrevented) {
      closeColumn(columnType);
    }
    setTimeout(() => {
      onCollapseEnd?.();
    }, 300);
  };
  const handleOpenColumn = () => {
    openColumn(columnType);
    onOpen?.();
  };
  return (
    <motion.div
      ref={columnRef}
      initial={false}
      exit={{ width: closedWidth }}
      variants={{ open: { width: openWidth }, closed: { width: closedWidth } }}
      animate={isOpen ? "open" : "closed"}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }} 
      className={cn("flex w-full flex-col transition-all duration-300 overflow-hidden rounded-3xl flex-1 h-full shadow-md bg-surface relative", className)}
      style={{
      
        minWidth: closedWidth,
        maxWidth: openWidth,
        flex: isOpen ? 1 : 0,
        ...style,
      }}
      
    >
      {isOpen && (
        <div className="flex flex-col h-full">
            {showsHeader && (
            <div className="column-header" style={headerStyle}>
              <div className="flex items-center gap-3 w-full">
                {collapsable && !toggle && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseColumn}
                  >
                     <ChevronLeft strokeWidth={3}/>
                  </Button>
                )}
                {toggle && toggle}
                {typeof title === "string" ? (
                  <h2 title={title} className="heading">
                    {title}
                  </h2>
                ) : (
                  title
                )}
              </div>
              {headerRight}
            </div>
          )}
          
          <div className={cn("h-full flex-1 overflow-y-hidden flex flex-col", contentContainerClassName)}>
            {children}
          </div>
        </div>
      )}
      
      {!isOpen && collapsable && (
        <div className="column-header justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenColumn}
          >
            <ChevronRight strokeWidth={3}/>
          </Button>
        </div>
      )}
    </motion.div>
  );
}
