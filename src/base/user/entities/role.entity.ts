import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class BaseRole extends BaseEntity {
    @Property({ columnType: "uuid", unique: "uuid" })
    uuid!: string

    @Property({ columnType: "character varying(100)", unique: "name" })
    name!: string

    @Property({ columnType: "character varying(200)" })
    description?: string
}
