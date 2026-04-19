"use client";
import { FieldGroup, SelectContent, Select, SelectTrigger, SelectValue, SelectItem,  Button,Scroller, Field, FieldError } from "@/components/ui";
import { FileUpload, FileUploadTrigger, FileUploadDropzone, FileUploadList, FileUploadItem, FileUploadItemPreview, FileUploadItemDelete, FileUploadItemMetadata } from "@/components/ui/file-upload";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { CreateDeskItemFormValues, UpdateDeskItemFormValues } from "@/types/desk";
import { MaterialType } from "@/features/deskItem/domain/value-objects";
import {  Pencil, Trash2, Upload, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useRef } from "react";
import { DeskItemMaterial } from "@/features/deskItem/infrastructure/queries";
const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
type MaterialUploadSectionProps = {
  existingMaterials?: DeskItemMaterial[];
  removedMaterialIds?: string[];
  onToggleExistingMaterial?: (materialId: string) => void;
}
export function MaterialUploadSection({
  existingMaterials = [],
  removedMaterialIds = [],
  onToggleExistingMaterial,
}: MaterialUploadSectionProps) {
  const {control, formState: {errors}} = useFormContext<CreateDeskItemFormValues | UpdateDeskItemFormValues>();
  const inputRef = useRef<HTMLInputElement>(null);
  const {fields, append, replace, remove} = useFieldArray({
      control,
      name: "materials",
  });
  const handleFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);
  const handleReplaceMaterial = useCallback((index: number, file: File | undefined) => {
    if (file) {
      replace(fields.map((field, i) => i === index ? {
        type: field.type,
        file,
        title: file.name
      } : field));
    }

  },[fields, replace]);
  
  const handleFileAccept = useCallback((file: File) => {
    append({
        type: null,
        file: file,
    });
    
  }, [append]);

 
  return (
    <FieldGroup className="h-full flex-1 bg-popover">
      {existingMaterials.length > 0 && (
        <div className="mb-3">
          <p className="mb-2 text-sm font-medium">Existing materials</p>
          <div className="space-y-2">
            {existingMaterials.map((material) => {
              const isRemoved = removedMaterialIds.includes(material.id);
              return (
                <div
                  key={material.id}
                  className={`flex items-center justify-between rounded-md border p-2 ${isRemoved ? "opacity-60" : ""}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{material.title ?? "Untitled material"}</p>
                    <p className="truncate text-xs text-muted-foreground">{material.url}</p>
                  </div>
                  {onToggleExistingMaterial && (
                    <Button
                      type="button"
                      size="icon"
                      variant={isRemoved ? "outline" : "destructive"}
                      onClick={() => onToggleExistingMaterial(material.id)}
                    >
                      {isRemoved ? <Undo2 className="size-4" /> : <Trash2 className="size-4" />}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
          
        <FileUpload 
            maxFiles={MAX_FILES} 
            multiple 
            value={fields.map((field) => field.file)}
            maxSize={MAX_FILE_SIZE} 
            onFileAccept={handleFileAccept} 
            onFileReject={handleFileReject}>

            <FileUploadDropzone>
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">
                  Or click to browse (max {MAX_FILES} files, up to {MAX_FILE_SIZE / 1024 / 1024}MB each)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="secondary" size="sm" className="mt-2 w-fit">
                  Browse files
                </Button>
              </FileUploadTrigger>

            </FileUploadDropzone>
          
        <FileUploadList>
        <Scroller
    hideScrollbar
    withNavigation
    orientation="horizontal"
    scrollTriggerMode="click"
    scrollStep={300}
    
    
    className="flex gap-4 snap-x snap-mandatory scroll-smooth"

  >

  
          {fields.map((field, index) => (
            <FileUploadItem key={field.id} className="w-full  rounded-lg flex-col" value={field.file}>
              <div className="flex items-center gap-2 w-full">
              <FileUploadItemPreview className="h-[60px] w-[60px] rounded-md object-cover aspect-square" />
              <FileUploadItemMetadata  />
            
              
              
              </div>

                <div className="flex w-full items-center gap-2">
              <Controller 
                  
                name={`materials.${index}.type`}  
                control={control} 
                render={({field, fieldState}) => ( 
                <Field className="flex-1" aria-invalid={fieldState.invalid}>
                  <Select
                    name={field.name}
                    value={field.value ?? undefined}
                    onValueChange={field.onChange}>
                    <SelectTrigger
                      id="form-select-material-type"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px]">
                          <SelectValue placeholder="Select material type" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {Object.entries(MaterialType).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                          {value}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}/>
                <input onChange={(e) => handleReplaceMaterial(index, e.target.files?.[0])} id="edit-material" type="file" ref={inputRef} className="hidden" />
                
                <Button aria-label="Replace material" onClick={() => inputRef.current?.click()} variant="outline" size="icon">
                  <Pencil className="size-4"/>
                </Button>
                <FileUploadItemDelete onClick={() => remove(index)} asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 />
                  </Button>
              </FileUploadItemDelete>
              </div>
            </FileUploadItem>
          ))}
            </Scroller>
        </FileUploadList>
      </FileUpload>
      <FieldError>{errors.materials?.[0]?.type?.message}</FieldError>
    </FieldGroup>
  );
}