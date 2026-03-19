import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ default: '' })
  alt: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  caption: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: false })
  saveToS3: boolean;
}
