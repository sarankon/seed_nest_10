import { Entity, PrimaryKey, Property, TextType } from "@mikro-orm/core";

@Entity()
export class Sample {

    @PrimaryKey({ type: 'bigint' })
    id!: number;
 
    @Property({columnType: "character varying(100)"})
    fullName!: string;
 
    @Property({columnType: "character varying(100)"})
    email!: string;
 
    @Property({columnType: "character varying(1000)"})
    password!: string;
 
    @Property({ type: TextType })
    bio = '';
    
}
