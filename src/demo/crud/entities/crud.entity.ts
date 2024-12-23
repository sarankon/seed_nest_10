import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class Crud extends BaseEntity {
    // @PrimaryKey({ columnType: "int", autoincrement: true })
    // id!: number

    @Property({ columnType: "character varying(255)" })
    topic!: string

    @Property({ columnType: "text" })
    detail? = ""
}
