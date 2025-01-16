import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class _Organization extends BaseEntity {
    @Property({ columnType: "uuid", unique: "uuid" })
    uuid!: string

    @Property({ columnType: "character varying(250)", unique: "name" })
    name!: string

    @Property({ columnType: "character varying(250)" })
    description?: string
}
