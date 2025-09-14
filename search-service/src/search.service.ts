import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

const PROJECTS_INDEX = 'projects';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly esService: ElasticsearchService) {}

  async indexProject(project: any): Promise<void> {
    try {
      await this.esService.index({
        index: PROJECTS_INDEX,
        id: project.id,
        document: project,
      });
      this.logger.log(`Project ${project.id} indexed successfully.`);
    } catch (error) {
      this.logger.error(`Failed to index project ${project.id}`, error.stack);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      await this.esService.delete({
        index: PROJECTS_INDEX,
        id: projectId,
      });
      this.logger.log(`Project ${projectId} deleted successfully.`);
    } catch (error) {
      // It's possible the document doesn't exist, which is fine.
      if (error.meta?.statusCode === 404) {
        this.logger.warn(`Project ${projectId} not found for deletion. Ignoring.`);
        return;
      }
      this.logger.error(`Failed to delete project ${projectId}`, error.stack);
      throw error;
    }
  }

  async search(query: string) {
    const { hits } = await this.esService.search({
      index: PROJECTS_INDEX,
      body: {
        query: {
          multi_match: {
            query,
            fields: ['title', 'description', 'requiredSkills'],
          },
        },
      },
    });
    return hits.hits.map((hit) => hit._source);
  }
}
