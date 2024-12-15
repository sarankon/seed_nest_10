import { Entity, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "src/base/entities/custom-base-entity.entity";

@Entity()
export class Upload extends CustomBaseEntity {

    @Property({ columnType: "character varying(250)" })
    originalFileName!:string;

    @Property({ columnType: "character varying(250)" })
    filePath!:string

    @Property({ columnType: "character varying(50)" })
    type?:string = "none"
    
}
