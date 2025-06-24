import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class BaseGroup extends BaseEntity {
    @Property({ columnType: "uuid" })
    uuid!: string

    @Property({ columnType: "character varying(100)" })
    name!: string

    @Property({ columnType: "character varying(200)" })
    description?: string
}
