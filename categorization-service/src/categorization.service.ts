import { Injectable } from '@nestjs/common';
import { JobType } from './common/enums/job-type.enum';
import { ExperienceLevel } from './common/enums/experience-level.enum';

@Injectable()
export class CategorizationService {
  getJobTypes(): string[] {
    return Object.values(JobType);
  }

  getExperienceLevels(): string[] {
    return Object.values(ExperienceLevel);
  }

  getSkills(): string[] {
    // In a real application, this would come from a database.
    return [
      'JavaScript',
      'TypeScript',
      'Node.js',
      'React',
      'Angular',
      'Vue.js',
      'SQL',
      'NoSQL',
      'Docker',
      'Kubernetes',
      'AWS',
      'GCP',
      'Azure',
    ];
  }
}
