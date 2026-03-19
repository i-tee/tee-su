import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Skill } from '../skills/skill.entity';

@Entity()
export class SkillGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: '' })
  subtitle: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: '' })
  category: string;

  @OneToMany(() => Skill, (skill) => skill.group)
  skills: Skill[];
}
