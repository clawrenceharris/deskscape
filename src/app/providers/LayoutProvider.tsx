"use client";
import { useMediaQuery } from "@/hooks";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
export type ColumnType = "left" | "center" | "right";
export type RightPanelMode = "notebook" | "profile";

interface LayoutProviderProps {
  children: React.ReactNode;
  initialColumns?: ColumnType[];
}
interface LayoutContextType {
  openRightLayout: () => void;
  isColumnOpen: (columnType: ColumnType) => boolean;
  openColumn: (columnType: ColumnType) => void;
  closeColumn: (columnType: ColumnType) => void;
  openColumns: ColumnType[];
  rightMode: RightPanelMode;
  setRightMode: (mode: RightPanelMode) => void;
  selectDeskLayout: (expanded: boolean) => void;
  selectSectionLayout: () => void;
  openExpandedLayout: () => void;
  selectNotebookLayout: () => void;
  closeRightLayout: () => void;
  openLeftLayout: () => void;
  normalizeLayout: (hasDesk: boolean, hasRightPanel: boolean) => void;
}
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);
const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
const LayoutProvider = ({ children, initialColumns }: LayoutProviderProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  const [openColumns, setOpenColumns] = useState<ColumnType[]>(
    initialColumns ?? ["left", "center"],
  );
  const [rightMode, setRightMode] = useState<RightPanelMode>("notebook");
  const [isExpandedMode, setIsExpandedMode] = useState(false);
  const unique = useCallback((columns: ColumnType[]) => {
    return [...new Set(columns)];
  }, []);
  
  const normalize = useCallback(
    (columns: ColumnType[], mobile: boolean) => {
      if (mobile) {
        const [first] = columns.length ? columns : ["left"];
        return [first] as ColumnType[];
      }
      const deduped = unique(columns);
      if(deduped.length === 0) return ["left", "center"] as ColumnType[];
      if(deduped.length === 1) return [deduped[0], "center"] as ColumnType[];
      return unique(deduped) as ColumnType[];
    },
    [unique],
  );

  const commitColumns = useCallback(
    (columns: ColumnType[]) => {
      setOpenColumns(normalize(columns, isMobile));
    },
    [isMobile, normalize],
  );

  const openLeftLayout = useCallback(() => {
    commitColumns(["left"]);
    setIsExpandedMode(false);
  }, [commitColumns]);

  /**
   * Selects the desk layout.
   * @param expanded - Whether to expand the layout (left layout closed, center layout open).
   */
  const selectDeskLayout = useCallback((expanded: boolean = false) => {
    if(expanded) {
      commitColumns(["center"]);
    }
    else {
      commitColumns(["left"]);
    }
  }, [commitColumns]);

  const selectNotebookLayout = useCallback(() => {
    setRightMode("notebook");
    commitColumns(["right"]);
  }, [commitColumns]);
  const selectSectionLayout = useCallback(() => {
    console.log("selectSectionLayout");
    commitColumns([isMobile ? "center" : "left"]);

  }, [commitColumns, isMobile]);
  const openRightLayout = useCallback(() => {
    commitColumns(["right"]);
  }, [commitColumns]);

  const openExpandedLayout = useCallback(() => {
    commitColumns(["center"]);
    setIsExpandedMode(true);
}, [commitColumns]);


  const closeRightLayout = useCallback(() => {
    setRightMode("notebook");
    // if not expanded mode and not mobile, open left layout
    if(!isExpandedMode && !isMobile){
      commitColumns(["left"]);
    }
    else{
      commitColumns(["center"]);
    }
  }, [isExpandedMode, commitColumns, isMobile]);
 
  const openColumn = useCallback(
    (columnType: ColumnType) => {
      if (columnType === "left") {
        openLeftLayout();
        return;
      }
      if (columnType === "center") {
        selectDeskLayout();
        return;
      }
      setRightMode((mode) => mode ?? "notebook");
      openRightLayout()
    },
    [openLeftLayout, openRightLayout, selectDeskLayout],
  );

  const closeColumn = useCallback(
    (columnType: ColumnType) => {
      if (columnType === "right") {
        
        closeRightLayout();
        
      }
      else if (columnType === "center") {
        openLeftLayout()
        
      }
      else if(columnType === "left"){
        openExpandedLayout();
        
      }
    },
    [closeRightLayout, openLeftLayout, openExpandedLayout],
  );

  const isColumnOpen = useCallback(
    (columnType: ColumnType) => openColumns.includes(columnType),
    [openColumns],
  );

  const normalizeLayout = useCallback(
    (hasDesk: boolean, hasRightPanel: boolean) => {
      if (hasRightPanel) {
        commitColumns(isMobile ? ["right"] : ["center", "right"]);
        return;
      }
      
      if (hasDesk && !isExpandedMode) {
        commitColumns(isMobile ? ["center"] : ["left", "center"]);
        return;
      }
      if(isExpandedMode){
        commitColumns(["center"]);
        return;
      }
      commitColumns(["left"]);
    },
    [commitColumns, isMobile, isExpandedMode],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenColumns((prev) => normalize(prev, isMobile));
  }, [isMobile, normalize]);

  const value = useMemo(
    (): LayoutContextType => ({
      isColumnOpen,
      openColumn,
      closeColumn,
      selectSectionLayout,
      openColumns,
      rightMode,
      setRightMode,
      selectDeskLayout,
      selectNotebookLayout,
      closeRightLayout,
      openExpandedLayout,
      openRightLayout,
      openLeftLayout,
      normalizeLayout,
    }),
    [closeColumn,selectSectionLayout,openExpandedLayout, closeRightLayout, isColumnOpen, normalizeLayout, openColumn, openColumns, openLeftLayout, openRightLayout, rightMode, selectNotebookLayout, selectDeskLayout],
  );

  return (
    <LayoutContext.Provider value={{
        ...value,
    }}>{children}</LayoutContext.Provider>
  );
};

export { LayoutProvider, useLayout };