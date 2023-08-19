import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("profiles")
export class Profile extends BaseEntity {
  @PrimaryColumn("text")
  id!: string;

  @Column("integer")
  nameColor: number;

  @Column("integer")
  textColor: number;

  @Column("text")
  extendedBio: string;
}
