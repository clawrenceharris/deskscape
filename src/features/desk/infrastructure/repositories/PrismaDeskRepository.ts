import { Prisma, PrismaClient } from "../../../../../generated/prisma/client";
import { DeskRepository } from "../../domain/repositories";
import { deskForDetailArgs, type DeskForDetail } from "../queries";
import { CreateDeskData, GetDesksInput } from "../../application/dto";

export class PrismaDeskRepository implements DeskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getDesks(input?: GetDesksInput): Promise<DeskForDetail[]> {
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
   };
    const newDesk = await this.prisma.desk.create({ data, ...deskForDetailArgs });
    return newDesk;
  }


  async deleteDesk(id: string): Promise<void> {
    await this.prisma.desk.delete({
      where: { id },
    });
  }
  
  async updateDesk(id: string, input: CreateDeskData): Promise<DeskForDetail> {
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
}
