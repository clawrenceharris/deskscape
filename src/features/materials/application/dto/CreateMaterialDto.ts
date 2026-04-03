import { Visibility } from "../../domain/value-objects/Visibility";
import { MaterialType } from "../../domain/value-objects/MaterialType";
/**
 * DTO stands for "Data Transfer Object".
 * 
 * A DTO is a design pattern used to transfer data between different layers or subsystems
 * of an application. It is an object that carries data but does not contain any business logic.
 * 
 * In this file, `CreateMaterialDto` is a DTO that defines the shape of the data required to create
 * a new material entity. It is used to pass structured data from, for example, a controller or service layer
 * to the application/business logic layer, ensuring data integrity and clarity.
 */

export class CreateMaterialDto {
    constructor(
        public readonly title: string,
        public readonly description: string,
        public readonly type: MaterialType,
        public readonly subject: string,
        public readonly authorId: string,
        public readonly visibility: Visibility
    ) {}

    static create(title: string, description: string, type: MaterialType, subject: string, authorId: string, visibility: Visibility): CreateMaterialDto {
        return new CreateMaterialDto(title, description, type, subject, authorId, visibility);
    }
}