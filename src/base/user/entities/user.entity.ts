import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"
import { BaseRole } from "src/base/user/entities/role.entity"
import { BaseGroup } from "src/base/user/entities/group.entity"
import { BaseOrganization } from "src/base/user/entities/organization.entity"

@Entity()
export class BaseUser extends BaseEntity {
    @Property({ columnType: "uuid", unique: "uuid" })
    uuid!: string

    @Property({ columnType: "character varying(250)", unique: "username" })
    username!: string

    @Property({ columnType: "character varying(250)" })
    password!: string

    // Basic Profile
    @Property({ columnType: "character varying(250)", nullable: true })
    firstName?: string

    @Property({ columnType: "character varying(250)", nullable: true })
    lastName?: string

    @Property({ columnType: "character varying(250)", nullable: true, unique: "email" })
    email?: string

    @Property({ columnType: "character varying(250)", nullable: true })
    phone?: string

    // Roles, Groups, Organization
    @ManyToMany(() => BaseRole)
    roles?: Collection<BaseRole> = new Collection<BaseRole>(this)

    @ManyToMany(() => BaseGroup)
    groups?: Collection<BaseGroup> = new Collection<BaseGroup>(this)

    @ManyToOne()
    organization?: BaseOrganization
}
