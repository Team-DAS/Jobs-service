import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, ILike } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto';
import { JobStatus } from '../common/enums';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async findAll(queryDto: JobQueryDto): Promise<Job[]> {
    const {
      q,
      jobType,
      experienceLevel,
      minSalary,
      page = 1,
      limit = 20,
    } = queryDto;

    const queryBuilder: SelectQueryBuilder<Job> = this.jobRepository
      .createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.OPEN });

    // Text search in title and description
    if (q) {
      queryBuilder.andWhere(
        '(job.title ILIKE :search OR job.description ILIKE :search)',
        { search: `%${q}%` },
      );
    }

    // Filter by job type
    if (jobType) {
      queryBuilder.andWhere('job.jobType = :jobType', { jobType });
    }

    // Filter by experience level
    if (experienceLevel) {
      queryBuilder.andWhere('job.experienceLevel = :experienceLevel', {
        experienceLevel,
      });
    }

    // Filter by minimum salary
    if (minSalary) {
      queryBuilder.andWhere(
        '(job.minSalary >= :minSalary OR job.maxSalary >= :minSalary)',
        { minSalary },
      );
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Order by creation date (newest first)
    queryBuilder.orderBy('job.createdAt', 'DESC');

    return await queryBuilder.getMany();
  }

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

    const job = this.jobRepository.create({
      ...createJobDto,
      employerId,
      status: createJobDto.status || JobStatus.OPEN,
    });

    return await this.jobRepository.save(job);
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

    // Validate salary range if both are provided
    const newMinSalary = updateJobDto.minSalary ?? job.minSalary;
    const newMaxSalary = updateJobDto.maxSalary ?? job.maxSalary;

    if (
      newMinSalary &&
      newMaxSalary &&
      newMinSalary > newMaxSalary
    ) {
      throw new BadRequestException(
        'Minimum salary cannot be greater than maximum salary',
      );
    }

    // Merge the updates
    Object.assign(job, updateJobDto);

    return await this.jobRepository.save(job);
  }

  async remove(id: string, employerId: string): Promise<void> {
    const job = await this.findOne(id);

    // Check if the job belongs to the authenticated employer
    if (job.employerId !== employerId) {
      throw new ForbiddenException(
        'You can only delete jobs that you have created',
      );
    }

    await this.jobRepository.remove(job);
  }

  async findByEmployer(employerId: string): Promise<Job[]> {
    return await this.jobRepository.find({
      where: { employerId },
      order: { createdAt: 'DESC' },
    });
  }
} 