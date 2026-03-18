import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Skill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  category: string;

  @Column({ default: false })
  isNew: boolean;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ default: 0 })
  level: number;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  order: number;
}
