import { ApplicationError } from "./ApplicationError";

export type ApplicationResult = { success: true } | 
{ success: false, error: ApplicationError };
export type ApplicationResultWithData<T> = { success: true, data: T } | 
{ success: false, error: ApplicationError };