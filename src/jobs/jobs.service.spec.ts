import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { JobType, ExperienceLevel, JobStatus } from '../common/enums';

describe('JobsService', () => {
  let service: JobsService;
  let repository: Repository<Job>;

  const mockRepository = {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

  const mockJob: Job = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    employerId: '987fcdeb-51a2-43d7-8f9e-123456789abc',
    title: 'Senior Backend Developer',
    description: 'We are looking for a skilled backend developer...',
    responsibilities: 'Design and implement APIs...',
    jobType: JobType.FULL_TIME,
    experienceLevel: ExperienceLevel.SENIOR_LEVEL,
    minSalary: 90000,
    maxSalary: 120000,
    requiredSkills: ['Java', 'Spring Boot', 'PostgreSQL'],
    status: JobStatus.OPEN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    repository = module.get<Repository<Job>>(getRepositoryToken(Job));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a job when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockJob);

      const result = await service.findOne(mockJob.id);

      expect(result).toEqual(mockJob);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockJob.id },
      });
    });

    it('should throw NotFoundException when job not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createJobDto = {
      title: mockJob.title,
      description: mockJob.description,
      jobType: mockJob.jobType,
      experienceLevel: mockJob.experienceLevel,
    };

    it('should create a job successfully', async () => {
      mockRepository.create.mockReturnValue(mockJob);
      mockRepository.save.mockResolvedValue(mockJob);

      const result = await service.create(createJobDto, mockJob.employerId);

      expect(result).toEqual(mockJob);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createJobDto,
        employerId: mockJob.employerId,
        status: JobStatus.OPEN,
      });
    });
  });

  describe('remove', () => {
    it('should delete a job when user owns it', async () => {
      mockRepository.findOne.mockResolvedValue(mockJob);
      mockRepository.remove.mockResolvedValue(mockJob);

      await service.remove(mockJob.id, mockJob.employerId);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockJob);
    });

    it('should throw ForbiddenException when user does not own the job', async () => {
      mockRepository.findOne.mockResolvedValue(mockJob);

      await expect(
        service.remove(mockJob.id, 'different-employer-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
}); 