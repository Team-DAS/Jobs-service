import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobType, ExperienceLevel, JobStatus } from '../../common/enums';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'employer_id' })
  employerId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({
    type: 'enum',
    enum: JobType,
    name: 'job_type',
  })
  jobType: JobType;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    name: 'experience_level',
  })
  experienceLevel: ExperienceLevel;

  @Column({ type: 'integer', nullable: true, name: 'min_salary' })
  minSalary: number;

  @Column({ type: 'integer', nullable: true, name: 'max_salary' })
  maxSalary: number;

  @Column({ type: 'text', array: true, default: '{}', name: 'required_skills' })
  requiredSkills: string[];

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN,
  })
  status: JobStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 