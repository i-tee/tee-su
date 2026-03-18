import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Education extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  year: Date;

  @Column()
  institution: string;

  @Column()
  specialty: string;

  @Column({ default: 0 })
  order: number;
}
