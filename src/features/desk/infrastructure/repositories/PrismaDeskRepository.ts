import { MemberRole, Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { DeskRepository } from "../../domain/repositories";
import { deskForDetailArgs, MyDeskForDetail, myDeskForDetailArgs, SchoolDeskForDetail, schoolDeskForDetailArgs, type DeskForDetail } from "../queries";
import { CreateDeskData, CreateDeskInput, GetDesksInput,JoinDeskInput, LeaveDeskInput} from "../../application/dto";
import { SchoolForDetail } from "@/features/school/infrastructure/queries";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";

export class PrismaDeskRepository implements DeskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(input?: GetDesksInput): Promise<DeskForDetail[]> {
    const where: Prisma.DeskWhereInput = input?.where ?? {};
    const desks = await this.prisma.desk.findMany({
      where, 
      ...deskForDetailArgs,
    });
    return desks;
  }


  async getById(id: string): Promise<DeskForDetail | null> {
    const desk = await this.prisma.desk.findUnique({
      where: { id },
      ...deskForDetailArgs,
    });
    return desk;
  }
  
  async create(input: CreateDeskData): Promise<DeskForDetail> {
   const data: Prisma.DeskCreateInput = {
    name: input.name,
    school: { connect: { id: input.schoolId } },
    creator: { connect: { userId: input.creatorId } },
    isPublic: input.isPublic,
    imageUrl: input.imageUrl,
    imagePath: input.imagePath,
    description: input.description,
    members: { create: { profile: { connect: { userId: input.creatorId } }, role: MemberRole.OWNER } },
   };
    const newDesk = await this.prisma.desk.create({ data, ...deskForDetailArgs });
    return newDesk;
  }


  async delete(id: string): Promise<void> {
    await this.prisma.desk.delete({
      where: { id },
    });
  }
  
  async update(id: string, input: CreateDeskInput): Promise<DeskForDetail> {
    const data: Prisma.DeskUpdateInput = {
      ...input
    };
    const updatedDesk = await this.prisma.desk.update({
      where: { id },
      data,
      ...deskForDetailArgs,
    });
    return updatedDesk;
  } 

  async join(input: JoinDeskInput): Promise<void> {
    const data: Prisma.MemberCreateInput = {
      profile: { connect: { userId: input.userId } },
      desk: { connect: { id: input.deskId } },
      role: input.role === "CONTRIBUTOR" ? MemberRole.CONTRIBUTOR : input.role === "OWNER" ? MemberRole.OWNER : MemberRole.VIEWER,
    };
    await this.prisma.member.create ({ data });
  }
  async leave(input: LeaveDeskInput): Promise<void> {
    await this.prisma.member.delete({
      where: { userId_deskId: { userId: input.userId, deskId: input.deskId } },
    });
  }

  async createSchoolDesk(school: SchoolForDetail): Promise<SchoolDeskForDetail> {
    const students = await this.prisma.profile.findMany({
      where: { schoolId: school.id },
      select: {
        userId: true,
      },
    });

    const deskData: Prisma.DeskCreateInput = {
      name: `${school.name} Desk`,
      school: { connect: { id: school.id } },
      isPublic: true,
      creator: { connect: { userId: "system" } },
      members: { create: students.map(student => ({ profile: { connect: { userId: student.userId } }, role: MemberRole.CONTRIBUTOR })) }
    };
    const desk = await this.prisma.desk.create({
      data: deskData
    })
    const data: Prisma.SchoolDeskCreateInput = {
      school: { connect: { id: school.id } },
      desk: { connect: { id: desk.id } },
      
    };
    const schoolDesk = await this.prisma.schoolDesk.create({ data,
       ...schoolDeskForDetailArgs,
     });
    return schoolDesk;
  }

  async createMyDesk(profile: ProfileForDetail): Promise<MyDeskForDetail> {
    
    const deskData: Prisma.DeskCreateInput = {
      name: `${profile.displayName}'s Desk`,
      creator: { connect: { userId: profile.userId } },
      isPublic: false,
      members: { create: { profile: { connect: { userId: profile.userId } }, role: MemberRole.OWNER } },
    };
    const desk = await this.prisma.desk.create({ data: deskData });
    const data: Prisma.UserDeskCreateInput = {
      desk: { connect: { id: desk.id } },
      user: { connect: { userId: profile.userId } },
    };
    const myDesk = await this.prisma.userDesk.create({ data, 
      ...myDeskForDetailArgs,
     });
    return myDesk;
  }
}
