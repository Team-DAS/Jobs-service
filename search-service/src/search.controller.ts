import { Controller, Get, Query, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @EventPattern('project.created')
  handleProjectCreated(@Payload() project: any) {
    this.logger.log(`Received project.created event for project ${project.id}`);
    return this.searchService.indexProject(project);
  }

  @EventPattern('project.updated')
  handleProjectUpdated(@Payload() project: any) {
    this.logger.log(`Received project.updated event for project ${project.id}`);
    return this.searchService.indexProject(project); // Re-indexing is an update
  }

  @EventPattern('project.deleted')
  handleProjectDeleted(@Payload() data: { id: string }) {
    this.logger.log(`Received project.deleted event for project ${data.id}`);
    return this.searchService.deleteProject(data.id);
  }

  @Get()
  search(@Query('q') query: string) {
    return this.searchService.search(query);
  }
}
