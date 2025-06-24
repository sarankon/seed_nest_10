import { PrimaryKey, Property } from "@mikro-orm/core"

export abstract class BaseEntity {
    @PrimaryKey({ columnType: "int", unsigned: true, autoincrement: true })
    id!: number

    @Property({ columnType: "boolean", nullable: false, default: true })
    isEnabled?: boolean

    @Property({ version: true })
    version!: number

    @Property({ columnType: "uuid", nullable: true })
    createdBy?: string

    @Property({ columnType: "timestamp", nullable: true })
    createdDate?: Date

    @Property({ columnType: "uuid", nullable: true })
    updatedBy?: string

    @Property({ columnType: "timestamp", nullable: true })
    updatedDate?: Date

    @Property({ columnType: "uuid", nullable: true })
    deletedBy?: string

    @Property({ columnType: "timestamp", nullable: true })
    deletedDate?: Date
}
