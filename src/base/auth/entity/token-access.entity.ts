import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class _TokenAccess extends BaseEntity {
    @Property({ columnType: "uuid", unique: "uuid" })
    uuid!: string

    @Property({ columnType: "character varying(250)" })
    ipAddress!: string

    @Property({ columnType: "timestamp" })
    expiresIn!: Date

    @Property({ columnType: "timestamp", nullable: true })
    isRevoked?: Date
}
