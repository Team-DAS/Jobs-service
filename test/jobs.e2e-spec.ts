import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from '../src/app.module';
import { JobStatus, JobType, ExperienceLevel } from '../src/common/enums';

describe('JobsController (e2e)', () => {
  let app: INestApplication;
  let validJwt: string;
  const employerId: string = 'd9b5e3f4-8a6a-4b0c-9d1a-3e7f6b9c1e2d';
  const anotherEmployerId: string = 'c8a4d2b3-7b59-4a0b-8c09-2d6e5a8b0d1c';
  const nonExistentId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

  beforeAll(() => {
    const payload = { sub: employerId, email: 'employer@test.com' };
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    validJwt = jwt.sign(payload, secret);
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Protected Job Endpoints', () => {
    let createdJobId: string;

    const createJobDto = {
      title: 'Senior E2E Tester',
      description: 'A job created during E2E tests.',
      jobType: JobType.FULL_TIME,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
    };

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/jobs')
        .set('Authorization', `Bearer ${validJwt}`)
        .send(createJobDto);
      createdJobId = response.body.id;
    });

    it('POST /jobs - Should create a job successfully', () => {
      expect(createdJobId).toBeDefined();
    });

    it('POST /jobs - Should fail with 401 Unauthorized without a token', () => {
      return request(app.getHttpServer()).post('/jobs').send(createJobDto).expect(401);
    });

    it('PUT /jobs/:id - Should update the job successfully', () => {
      const updateDto = { title: 'Lead E2E Tester', status: JobStatus.CLOSED };
      return request(app.getHttpServer())
        .put(`/jobs/${createdJobId}`)
        .set('Authorization', `Bearer ${validJwt}`)
        .send(updateDto)
        .expect(200)
        .then((res) => {
          expect(res.body.title).toEqual(updateDto.title);
          expect(res.body.status).toEqual(updateDto.status);
        });
    });

    it('PUT /jobs/:id - Should fail with 404 for a non-existent job', () => {
      return request(app.getHttpServer())
        .put(`/jobs/${nonExistentId}`)
        .set('Authorization', `Bearer ${validJwt}`)
        .send({ title: 'This will fail' })
        .expect(404);
    });

    it('PUT /jobs/:id - Should fail with 403 for a job owned by another employer', () => {
      const anotherUserJwt = jwt.sign({ sub: anotherEmployerId }, process.env.JWT_SECRET || 'your-secret-key');
      return request(app.getHttpServer())
        .put(`/jobs/${createdJobId}`)
        .set('Authorization', `Bearer ${anotherUserJwt}`)
        .send({ title: 'Malicious Update' })
        .expect(403);
    });

    it('DELETE /jobs/:id - Should delete the job and then return 404', async () => {
      // Delete the job and expect 204 No Content
      await request(app.getHttpServer())
        .delete(`/jobs/${createdJobId}`)
        .set('Authorization', `Bearer ${validJwt}`)
        .expect(204);

      // Verify that trying to get the same job now results in 404 Not Found
      return request(app.getHttpServer())
        .get(`/jobs/${createdJobId}`)
        .expect(404);
    });
  });

  describe('Public Job Endpoints', () => {
    let publicJobId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/jobs')
        .set('Authorization', `Bearer ${validJwt}`)
        .send({ title: 'Public Test Job', description: 'A public job', jobType: JobType.CONTRACT, experienceLevel: ExperienceLevel.ENTRY_LEVEL });
      publicJobId = response.body.id;
    });

    it('GET /jobs - Should return a list of jobs', () => {
      return request(app.getHttpServer())
        .get('/jobs')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.some(job => job.id === publicJobId)).toBe(true);
        });
    });

    it('GET /jobs/:id - Should return a single job by its ID', () => {
      return request(app.getHttpServer())
        .get(`/jobs/${publicJobId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toEqual(publicJobId);
        });
    });

    it('GET /jobs/:id - Should return 404 for a non-existent job ID', () => {
      return request(app.getHttpServer())
        .get(`/jobs/${nonExistentId}`)
        .expect(404);
    });
  });
});