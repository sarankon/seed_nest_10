import { Entity, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class User extends BaseEntity {
    @Property({ columnType: "character varying(250)" })
    username!: string

    @Property({ columnType: "character varying(250)" })
    password!: string
    
    // Basic Profile
    @Property({ columnType: "character varying(250)" })
    firstName!: string

    @Property({ columnType: "character varying(250)" })
    lastName!: string

    @Property({ columnType: "character varying(250)" })
    email!: string

    @Property({ columnType: "character varying(250)" })
    phone!: string
}
