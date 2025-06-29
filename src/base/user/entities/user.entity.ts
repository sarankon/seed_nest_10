import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core"
import { BaseEntity } from "src/base/base.entity"
import { BaseRole } from "src/base/user/entities/role.entity"
import { BaseGroup } from "src/base/user/entities/group.entity"
import { BaseOrganization } from "src/base/user/entities/organization.entity"

@Entity()
export class BaseUser extends BaseEntity {
    @Property({ columnType: "uuid" })
    uuid!: string

    @Property({ columnType: "character varying(50)", unique: true })
    username!: string

    @Property({ columnType: "character varying(200)" })
    password!: string

    // Basic Profile
    @Property({ columnType: "character varying(100)", nullable: true })
    firstName?: string

    @Property({ columnType: "character varying(100)", nullable: true })
    lastName?: string

    @Property({ columnType: "character varying(100)", nullable: true, unique: true })
    email?: string

    @Property({ columnType: "character varying(50)", nullable: true })
    phone?: string

    // Roles, Groups, Organization
    @ManyToMany(() => BaseRole)
    roles?: Collection<BaseRole> = new Collection<BaseRole>(this)

    @ManyToMany(() => BaseGroup)
    groups?: Collection<BaseGroup> = new Collection<BaseGroup>(this)

    @ManyToOne()
    organization?: BaseOrganization
}
