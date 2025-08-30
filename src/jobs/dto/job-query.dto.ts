import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { JobType, ExperienceLevel } from '../../common/enums';

export class JobQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minSalary?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
} 