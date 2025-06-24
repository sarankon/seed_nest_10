import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class BaseOrganization extends BaseEntity {
    @Property({ columnType: "uuid", unique: true })
    uuid!: string

    @Property({ columnType: "character varying(100)", unique: true })
    name!: string

    @Property({ columnType: "character varying(200)" })
    description?: string
}
