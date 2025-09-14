import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from './entities/job.entity';
import { CreateJobDto, UpdateJobDto } from './dto';
import { JobStatus } from '../common/enums';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @Inject('PROJECT_EVENTS_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async create(createJobDto: CreateJobDto, employerId: string): Promise<Job> {
    // Validate salary range if both are provided
    if (
      createJobDto.minSalary &&
      createJobDto.maxSalary &&
      createJobDto.minSalary > createJobDto.maxSalary
    ) {
      throw new BadRequestException(
        'Minimum salary cannot be greater than maximum salary',
      );
    }

    const newJob = new Job();
    newJob.employerId = employerId;
    newJob.title = createJobDto.title;
    newJob.description = createJobDto.description;
    newJob.responsibilities = createJobDto.responsibilities;
    newJob.jobType = createJobDto.jobType;
    newJob.experienceLevel = createJobDto.experienceLevel;
    newJob.minSalary = createJobDto.minSalary;
    newJob.maxSalary = createJobDto.maxSalary;
    newJob.requiredSkills = createJobDto.requiredSkills;
    newJob.status = JobStatus.OPEN;

    const createdJob = await this.jobRepository.save(newJob);
    this.client.emit('project.created', createdJob);
    return createdJob;
  }

  async update(
    id: string,
    updateJobDto: UpdateJobDto,
    employerId: string,
  ): Promise<Job> {
    const job = await this.findOne(id);

    // Check if the job belongs to the authenticated employer
    if (job.employerId !== employerId) {
      throw new ForbiddenException(
        'You can only update jobs that you have created',
      );
    }

    // Manually map allowed fields to prevent mass assignment
    // Se actualiza las propiedades del DTO a la entidad Job
    for (const key in updateJobDto) {
      if (updateJobDto[key] !== undefined) {
        job[key] = updateJobDto[key];
      }
    }

    // Validate salary range after potential updates
    if (
      job.minSalary &&
      job.maxSalary &&
      job.minSalary > job.maxSalary
    ) {
      throw new BadRequestException(
        'Minimum salary cannot be greater than maximum salary',
      );
    }

    const updatedJob = await this.jobRepository.save(job);
    this.client.emit('project.updated', updatedJob);
    return updatedJob;
  }

  async remove(id: string, employerId: string): Promise<void> {
    const job = await this.findOne(id);

    // Check if the job belongs to the authenticated employer
    if (job.employerId !== employerId) {
      throw new ForbiddenException(
        'You can only delete jobs that you have created',
      );
    }

    this.client.emit('project.deleted', { id });
    await this.jobRepository.remove(job);
  }

  async findByEmployer(employerId: string): Promise<Job[]> {
    return await this.jobRepository.find({
      where: { employerId },
      order: { createdAt: 'DESC' },
    });
  }
} 