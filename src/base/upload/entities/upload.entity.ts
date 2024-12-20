import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/entities/base.entity"

@Entity()
export class Upload extends BaseEntity {
    @Property({ columnType: "character varying(250)" })
    originalFileName!: string

    @Property({ columnType: "character varying(250)" })
    filePath!: string

    @Property({ columnType: "character varying(50)" })
    type?: string = "none"
}
