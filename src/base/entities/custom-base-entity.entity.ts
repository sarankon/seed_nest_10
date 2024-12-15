import { PrimaryKey, Property, types } from "@mikro-orm/core"

export abstract class CustomBaseEntity {
    @PrimaryKey({ type: types.bigint, autoincrement: true })
    id!: number

    @Property({ type: types.datetime })
    createdDate!: Date

    @Property({ type: types.datetime })
    updatedDate!: Date

    constructor() {
        this.createdDate = new Date()
        this.updatedDate = new Date()
    }
}
