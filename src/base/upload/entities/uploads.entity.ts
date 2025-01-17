import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class _Uploads extends BaseEntity {
    @Property({ columnType: "character varying(250)" })
    originalFileName!: string

    @Property({ columnType: "character varying(250)" })
    mimeTypes!: string

    @Property({ columnType: "character varying(250)" })
    name!: string

    @Property({ columnType: "character varying(250)" })
    filePath!: string

    @Property({ columnType: "character varying(250)" })
    fileUrl!: string
}
