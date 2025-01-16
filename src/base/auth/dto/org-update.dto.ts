import { PartialType } from "@nestjs/swagger";
import { OrganizationCreateDto } from "./org-create.dto";

export class OrganizationUpdateDto extends PartialType(OrganizationCreateDto) {}