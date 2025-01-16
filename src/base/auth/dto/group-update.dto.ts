import { PartialType } from "@nestjs/swagger";
import { GroupCreateDto } from "./group-create.dto";

export class GroupUpdateDto extends PartialType(GroupCreateDto) {}