"use client";
import { useState } from "react";
import { Form } from "@/components/form";
import { CreateDeskItemFormValues, UpdateDeskItemFormValues } from "@/types";
import { DeskItemForDetail } from "../../../infrastructure/queries";
import { useCreateDeskItemForm } from "../../hooks";
import { useUpdateDeskItemForm } from "../../hooks/useUpdateDeskItemForm";
import {ItemDetailsSection, MaterialUploadSection} from ".";
import { AnimatePresence, motion } from "motion/react";

type CreateDeskItemFormProps = {
    deskId?: string;
    deskItemId?: string;
    onSuccess?: (deskItem: DeskItemForDetail) => void;
    onError?: (error: string) => void;
    onCancel?: () => void;
}

const panelTransition = {
  type: "tween" as const,
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1] as const,
};
export function CreateOrUpdateDeskItemForm({
  deskId,
  deskItemId,
  onSuccess,
  onError,
}: CreateDeskItemFormProps) {
  const [showMaterialUploadSection, setShowMaterialUploadSection] = useState(false);  
  const isUpdateMode = !!deskItemId;
  const createState = useCreateDeskItemForm({
    deskId: deskId ?? "",
    onSuccess,
    onError,
  });
  const updateState = useUpdateDeskItemForm({
    deskItemId: deskItemId ?? null,
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
  const handleSubmit = (data: CreateDeskItemFormValues | UpdateDeskItemFormValues) =>{
    if (isUpdateMode) {
      return updateState.updateDeskItem(data as UpdateDeskItemFormValues);
    }
    return createState.createDeskItem(data as CreateDeskItemFormValues);
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
         { !showMaterialUploadSection && 
          <motion.div
              key={"create-desk-item-form"}
              initial={"open"}
              className="h-full flex-1 bg-popover"
              exit={{ x: "-100%" }}
              variants={{ open: { x: "0%" }, closed: { x: "-100%" } }}
              animate={showMaterialUploadSection ? "closed" : "open"}
              transition={panelTransition} 
            >
              <ItemDetailsSection />
          </motion.div>
        }
        { showMaterialUploadSection &&
           
           <motion.div key={"material-upload-section"}
             initial={ "closed" }
             exit={{ x: "100%" }}
              className="h-full flex-1 bg-popover"
             variants={{ open: { x: "0%" }, closed: { x: "100%" } }}
             animate={showMaterialUploadSection ? "open" : "closed"}
              transition={panelTransition}>
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