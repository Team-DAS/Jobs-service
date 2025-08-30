import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import {
  CreateJobDto,
  UpdateJobDto,
  JobResponseDto,
  JobQueryDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role?: string;
  };
}

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(@Query() queryDto: JobQueryDto): Promise<JobResponseDto[]> {
    return await this.jobsService.findAll(queryDto);
  }

  @Get(':jobId')
  async findOne(@Param('jobId') id: string): Promise<JobResponseDto> {
    return await this.jobsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createJobDto: CreateJobDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<JobResponseDto> {
    return await this.jobsService.create(createJobDto, req.user.userId);
  }

  @Put(':jobId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('jobId') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<JobResponseDto> {
    return await this.jobsService.update(id, updateJobDto, req.user.userId);
  }

  @Delete(':jobId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('jobId') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    await this.jobsService.remove(id, req.user.userId);
  }
} 