import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
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

  @Column({ nullable: true })
  groupId: number;

  @Column({ default: 0 })
  level: number;

  @Column({ default: false })
  isHighlighted: boolean;

  @ManyToOne(() => SkillGroup, (group) => group.skills)
  @JoinColumn({ name: 'groupId' })
  group: SkillGroup;
}
