import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class _User extends BaseEntity {

    @Property({ columnType: "uuid", unique: "uuid"})
    uuid!: string

    @Property({ columnType: "character varying(250)", unique: "username" })
    username!: string

    @Property({ columnType: "character varying(250)" })
    password!: string

    // Basic Profile
    @Property({ columnType: "character varying(250)" })
    firstName!: string

    @Property({ columnType: "character varying(250)" })
    lastName!: string

    @Property({ columnType: "character varying(250)", unique: "email" })
    email!: string

    @Property({ columnType: "character varying(250)", nullable: true })
    phone?: string
}
