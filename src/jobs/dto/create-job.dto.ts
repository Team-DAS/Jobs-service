import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { JobType, ExperienceLevel, JobStatus } from '../../common/enums';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  responsibilities?: string;

  @IsEnum(JobType)
  jobType: JobType;

  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @IsOptional()
  @IsInt()
  @Min(0)
  minSalary?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxSalary?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
} 