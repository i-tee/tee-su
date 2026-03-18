import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  city: string;

  @Column({ default: 0 })
  experience: number;

  @Column({ default: '' })
  tagline: string;

  @Column({ default: '' })
  heroText: string;

  @Column({ default: 0 })
  statsProjects: number;

  @Column({ default: 0 })
  statsBots: number;
}
