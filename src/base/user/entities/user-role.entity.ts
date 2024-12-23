import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class UserRole extends BaseEntity {
    @Property({ columnType: "character varying(250)" })
    roleName!: string
}
