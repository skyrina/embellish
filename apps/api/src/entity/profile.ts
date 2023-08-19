import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import zod from "zod";

export const ProfileSchema = zod.object({
  id: zod.string().regex(/^[0-9]+$/, "id must be a numeric string").optional(),
  nameColor: zod.number().int("color must be an integer").nullable().optional(),
  textColor: zod.number().int("color must be an integer").nullable().optional(),
  extendedBio: zod.string().max(4000, "extendedBio must be at most 4000 characters long").nullable().optional(),
})


@Entity("profiles")
export class Profile extends BaseEntity {
  @PrimaryColumn("text")
  id!: string;

  @Column("integer")
  nameColor?: number;

  @Column("integer")
  textColor?: number;

  @Column("text")
  extendedBio?: string;
}
