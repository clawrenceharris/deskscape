import React, { ReactNode, useEffect, useRef } from "react";
import { useLayout } from "../../../context/LayoutContext";
import "./Column.css";
import { ColumnType, Icon } from "../../../types";
import { chevron_left, chevron_right } from "../../../assets/icons";
import { Button } from "../../shared";
import { motion, MotionProps } from "motion/react";

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
  contentContainerStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  toggleIcon?: Icon;
  showsHeader?: boolean;
  padding?: number | string;
  children?: React.ReactNode;
}
const Column = ({
  title,
  openWidth,
  closedWidth,

  style,
  containerStyle,
  headerRight,
  contentContainerStyle,
  columnType,
  collapsable = true,
  onCollapse,
  onCollapseEnd,
  onOpen,
  headerStyle,
  padding,
  toggleIcon,
  showsHeader = true,
  children,
  ...rest
}: ColumnProps) => {
  const { openColumn, closeColumn, isColumnOpen } = useLayout();
  const columnRef = useRef<HTMLDivElement>(null);
  const isOpen = isColumnOpen(columnType);

  const handleCloseColumn = (e: React.MouseEvent<HTMLButtonElement>) => {
    onCollapse && onCollapse(e);
    if (!e.defaultPrevented) {
      closeColumn(columnType);
    }
    setTimeout(() => {
      onCollapseEnd && onCollapseEnd();
    }, 300);
  };
  const handleOpenColumn = () => {
    openColumn(columnType);
  };
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        onOpen && onOpen();
      }, 300);
    }
  }, [isOpen]);
  return (
    <motion.div
      ref={columnRef}
      className="column"
      style={{
        minWidth: closedWidth,
        maxWidth: openWidth,
        flex: isOpen ? 1 : 0,
        ...style,
      }}
      {...rest}
    >
      {isOpen && (
        <div className="column-container">
          {showsHeader && (
            <header className="header" style={headerStyle}>
              <div className="header-left">
                {collapsable && (
                  <Button
                    buttonType="icon"
                    icon={toggleIcon || chevron_left}
                    onClick={handleCloseColumn}
                  />
                )}
                {typeof title === "string" ? (
                  <h2 title={title} className="heading">
                    {title}
                  </h2>
                ) : (
                  title
                )}
              </div>
              {headerRight}
            </header>
          )}
          <div style={contentContainerStyle} className="column-content">
            {children}
          </div>
        </div>
      )}
      {!isOpen && collapsable && (
        <header className="header" style={{ justifyContent: "center" }}>
          <Button
            buttonType="icon"
            icon={chevron_right}
            onClick={handleOpenColumn}
          />
        </header>
      )}
    </motion.div>
  );
};

export default Column;
