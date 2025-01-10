import { PrimaryKey, Property } from "@mikro-orm/core"

export abstract class BaseEntity {
    @PrimaryKey({ columnType: "int", unsigned: true, autoincrement: true })
    id!: number

    @Property({ columnType: "boolean", nullable: false, default: true })
    isEnable?: boolean

    @Property({ columnType: "timestamp", nullable: true })
    isDeleted?: Date

    @Property({ columnType: "int", nullable: true, unsigned: true })
    createdBy?: number

    @Property({ columnType: "timestamp", nullable: true, defaultRaw: `current_timestamp()` })
    createdDate?: Date

    @Property({ columnType: "int", nullable: true, unsigned: true })
    updatedBy?: number

    @Property({ columnType: "timestamp", nullable: true, defaultRaw: `current_timestamp()`, extra: "on update current_timestamp()" })
    updatedDate?: Date

    @Property({ version: true})
    version!: number;
}
