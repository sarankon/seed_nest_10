import { Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core"
import { _Group } from "src/base/auth/entity/group.entity"
import { _Organization } from "src/base/auth/entity/organization.entity"
import { _Role } from "src/base/auth/entity/role.entity"
import { BaseEntity } from "src/base/base.entity"

@Entity()
export class _User extends BaseEntity {
    @Property({ columnType: "uuid", unique: "uuid" })
    uuid!: string

    @Property({ columnType: "character varying(250)", unique: "username" })
    username!: string

    @Property({ columnType: "character varying(250)" })
    password!: string

    // Basic Profile
    @Property({ columnType: "character varying(250)", nullable: true })
    firstName!: string

    @Property({ columnType: "character varying(250)", nullable: true })
    lastName!: string

    @Property({ columnType: "character varying(250)", unique: "email" })
    email!: string

    @Property({ columnType: "character varying(250)", nullable: true })
    phone?: string

    // Organization, Roles, Groups
    @ManyToOne()
    organization?: _Organization

    @ManyToMany(() => _Role)
    roles?: Collection<_Role> = new Collection<_Role>(this)

    @ManyToMany(() => _Group)
    groups?: Collection<_Group> = new Collection<_Group>(this)
}
