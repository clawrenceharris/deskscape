import { CreateSchoolData, GetSchoolsInput, UpdateSchoolData } from "../../application/dto";
import { SchoolForDetail } from "../../infrastructure/queries";

export interface SchoolRepository  {
    getSchools(input?: GetSchoolsInput): Promise<SchoolForDetail[]>;
    getSchoolById(id: string): Promise<SchoolForDetail | null>;
    createSchool(input: CreateSchoolData): Promise<SchoolForDetail>;
    updateSchool(input: UpdateSchoolData): Promise<SchoolForDetail>;
    deleteSchool(id: string): Promise<void>;
    
}