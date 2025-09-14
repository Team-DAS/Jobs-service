import { JobType, ExperienceLevel, JobStatus } from '../../common/enums';

export class JobResponseDto {
  id: string;
  employerId: string;
  title: string;
  description: string;
  responsibilities?: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  requiredSkills?: string[];
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
} 