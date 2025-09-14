import { Controller, Get } from '@nestjs/common';
import { CategorizationService } from './categorization.service';

@Controller('categories')
export class CategorizationController {
  constructor(private readonly categorizationService: CategorizationService) {}

  @Get('job-types')
  getJobTypes() {
    return this.categorizationService.getJobTypes();
  }

  @Get('experience-levels')
  getExperienceLevels() {
    return this.categorizationService.getExperienceLevels();
  }

  @Get('skills')
  getSkills() {
    return this.categorizationService.getSkills();
  }
}
