import { Entity, PrimaryKey, Property, TextType } from "@mikro-orm/core"

@Entity()
export class Crud {
    @PrimaryKey({ type: "bigint" })
    id!: number

    @Property({ columnType: "character varying(50)" })
    topic!: string

    @Property({ type: TextType })
    detail? = ""
}
