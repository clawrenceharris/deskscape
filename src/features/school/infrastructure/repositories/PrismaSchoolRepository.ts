import { Prisma, PrismaClientType } from "@/lib/db/prisma";
import { SchoolRepository } from "../../domain/repositories";
import { SchoolForDetail, schoolForDetailArgs } from "../queries";
import { CreateSchoolData, GetSchoolsInput, UpdateSchoolData } from "../../application/dto";

export class PrismaSchoolRepository implements SchoolRepository {
    constructor(private readonly prisma: PrismaClientType) {}
    

    async getSchools(input?: GetSchoolsInput): Promise<SchoolForDetail[]> {
        const where: Prisma.SchoolWhereInput = input?.where ?? {};
        const schools = await this.prisma.school.findMany({
            where,
            ...schoolForDetailArgs,
        });
        return schools;
    }

    async getSchoolById(id: string): Promise<SchoolForDetail | null> {
        const school = await this.prisma.school.findUnique({
            where: { id },
            ...schoolForDetailArgs,
        });
        return school;
    }

    async createSchool(input: CreateSchoolData): Promise<SchoolForDetail> {
        const data: Prisma.SchoolCreateInput = {
            name: input.name,
            students: {
                connect: input.students.map(student => ({
                    userId: student.userId,
                })),
            },
            desks: {
                connect: input.desks.map(desk => ({
                    id: desk.id,
                })),
            },
        };
        const newSchool = await this.prisma.school.create({
            data,
            ...schoolForDetailArgs,
        });
        return newSchool;
    }
    
    async updateSchool(input: UpdateSchoolData): Promise<SchoolForDetail> {
        const data: Prisma.SchoolUpdateInput = {
            ...input,
            students: {
                connect: input.students?.map(student => ({
                    userId: student.userId,
                })),
            },
            desks: {
                connect: input.desks?.map(desk => ({
                    id: desk.id,
                })),
            },
            
        };
        const updatedSchool = await this.prisma.school.update({
            where: { id: input.id },
            data,
            ...schoolForDetailArgs,
        });
        return updatedSchool;
    }
    
    async deleteSchool(id: string): Promise<void> {
        await this.prisma.school.delete({
            where: { id },
        });
    }
}