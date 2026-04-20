"use client";
import { useState } from "react";
import { Form } from "@/components/form";
import { CreateNotebookFormValues, UpdateNotebookFormValues } from "@/types";
import { NotebookForDetail } from "../../../infrastructure/queries";
import { useCreateNotebookForm } from "../../hooks";
import { useUpdateNotebookForm } from "../../hooks/useUpdateNotebookForm";
import {NotebookDetailsSection, MaterialUploadSection} from ".";
import { AnimatePresence, motion } from "motion/react";

type CreateNotebookFormProps = {
    deskId?: string;
    notebookId?: string;
    onSuccess?: (notebook: NotebookForDetail) => void;
    onError?: (error: string) => void;
    onCancel?: () => void;
}

const panelTransition = {
  type: "tween" as const,
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1] as const,
};
export function CreateOrUpdateNotebookForm({
  deskId,
  notebookId,
  onSuccess,
  onError,
}: CreateNotebookFormProps) {
  const [showMaterialUploadSection, setShowMaterialUploadSection] = useState(false);  
  const isUpdateMode = !!notebookId;
  const createState = useCreateNotebookForm({
    deskId: deskId ?? "",
    onSuccess,
    onError,
  });
  const updateState = useUpdateNotebookForm({
    notebookId: notebookId ?? null,
    onSuccess,
    onError,
  });
  const form = isUpdateMode ? updateState.form : createState.form;
  const isLoading = isUpdateMode ? updateState.isLoading : createState.isLoading;
  

  const handleContinue = () =>{
    setShowMaterialUploadSection(true);
  }
  const handleBack = () =>{
    setShowMaterialUploadSection(false);
  }
  const handleSubmit = (data: CreateNotebookFormValues | UpdateNotebookFormValues) =>{
    if (isUpdateMode) {
      return updateState.updateNotebook(data as UpdateNotebookFormValues);
    }
    return createState.createNotebook(data as CreateNotebookFormValues);
  }
  return (
    <Form
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form={form as any}
      cancelText="Back"
      showsCancelButton={showMaterialUploadSection}
      onSubmit={showMaterialUploadSection ? handleSubmit : handleContinue}
      submitText={showMaterialUploadSection ? (isUpdateMode ? "Update" : "Create") : "Next"}
      isLoading={isLoading}
      enableBeforeUnloadProtection
      onCancel={showMaterialUploadSection ? handleBack : undefined}
    >
      <AnimatePresence mode="sync">
        <div className="h-full flex-1 bg-popover overflow-hidden p-2">
          {!showMaterialUploadSection && 
          <motion.div
              key={"create-notebook-form"}
              initial={"open"}
              className="h-full flex-1 bg-popover"
              exit={{ x: "-100%" }}
              variants={{ open: { x: "0%" }, closed: { x: "-100%" } }}
              animate={showMaterialUploadSection ? "closed" : "open"}
              transition={panelTransition} 
            >
            <NotebookDetailsSection />
          </motion.div>
          }
          {showMaterialUploadSection &&
            
          <motion.div key={"material-upload-section"}
            initial={ "closed" }
            exit={{ x: "100%" }}
            className="h-full flex-1 bg-popover"
            variants={{ open: { x: "0%" }, closed: { x: "100%" } }}
            animate={showMaterialUploadSection ? "open" : "closed"}
            transition={panelTransition}
          >

            <MaterialUploadSection
              existingMaterials={isUpdateMode ? updateState.existingMaterials : []}
              removedMaterialIds={isUpdateMode ? updateState.removedMaterialIds : []}
              onToggleExistingMaterial={isUpdateMode ? updateState.toggleRemovedMaterialId : undefined}
            />
          </motion.div>}
        </div>
      </AnimatePresence>
    </Form>
  );
}