import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { SkillGroup } from '../skill-groups/skill-group.entity';

@Entity()
export class Skill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isNew: boolean;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => SkillGroup, (group) => group.skills)
  group: SkillGroup;
}
