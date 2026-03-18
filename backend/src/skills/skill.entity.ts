import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn, // ← добавить импорт
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

  @Column({ nullable: true }) // ← добавить явный FK-столбец
  groupId: number;

  @ManyToOne(() => SkillGroup, (group) => group.skills)
  @JoinColumn({ name: 'groupId' }) // ← связать с колонкой выше
  group: SkillGroup;
}
