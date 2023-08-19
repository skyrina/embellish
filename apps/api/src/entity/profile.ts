import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import zod from "zod";

export const IdSchema = zod.string().regex(/^[0-9]+$/, "id must be a numeric string");

export const ProfileSchema = zod.object({
  id: IdSchema.optional(),
  nameColor: zod.number().int("color must be an integer").nullable().optional(),
  textColor: zod.number().int("color must be an integer").nullable().optional(),
  extendedBio: zod.string().max(4000, "extendedBio must be at most 4000 characters long").nullable().optional(),
})


@Entity("profile")
export class Profile extends BaseEntity {
  @PrimaryColumn("text")
  id!: string;

  @Column("integer", { nullable: true })
  nameColor?: number;

  @Column("integer", { nullable: true })
  textColor?: number;

  @Column("text", { nullable: true })
  extendedBio?: string;
}
