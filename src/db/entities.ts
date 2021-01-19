import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class VoiceChannel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  owner: string;
  @Column()
  createdAt: Date;
}
