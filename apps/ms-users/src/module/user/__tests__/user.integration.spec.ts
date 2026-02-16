import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { UserModule } from '../user.module';
import { DatabaseService } from 'src/config/database.config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUserTransactionsUseCase } from '../usecase/get-user-transactions.usecase';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UserController and AuthController (integration)', () => {
  let app: INestApplication;
  let mockDatabaseService: any;
  let mockGetUserTransactionsUseCase: jest.Mocked<GetUserTransactionsUseCase>;

  const mockUsers = [
    {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    },
    {
      id: 'user-2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'hashedPassword',
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    mockDatabaseService = {
      user: {
        create: jest.fn().mockResolvedValue({
          id: 'user-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'new-user@example.com',
          password: 'hashedPassword',
        }),
        findMany: jest.fn().mockResolvedValue(mockUsers),
        findUnique: jest.fn().mockImplementation(({ where }) => {
          if (where.id === 'user-1') {
            return Promise.resolve(mockUsers[0]);
          }
          if (where.email === 'john@example.com') {
            return Promise.resolve(mockUsers[0]);
          }
          if (where.email === 'new-user@example.com') {
            return Promise.resolve(null);
          }
          return Promise.resolve(null);
        }),
        update: jest.fn().mockResolvedValue({
          id: 'user-1',
          firstName: 'John Updated',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
        }),
        delete: jest.fn().mockResolvedValue(undefined),
      },
    } as unknown as DatabaseService;

    mockGetUserTransactionsUseCase = {
      execute: jest.fn().mockResolvedValue([
        { id: 'tx-1', user_id: 'user-1', amount: 100, type: 'CREDIT' },
        { id: 'tx-2', user_id: 'user-1', amount: 50, type: 'DEBIT' },
      ]),
      onModuleInit: jest.fn(),
    } as any;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
          load: [() => ({ JWT_SECRET: 'test-secret', DATABASE_URL: 'test-db', JWT_INTERNAL_SECRET: 'test-internal' })],
        }),
        UserModule,
      ],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .overrideProvider(GetUserTransactionsUseCase)
      .useValue(mockGetUserTransactionsUseCase)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          context.switchToHttp().getRequest().user = { id: 'user-123' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    jest.clearAllMocks();
  });

  describe('POST /users - Create User', () => {
    it('should create user and return without password', async () => {
      const body = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'new-user@example.com',
        password: 'password123',
      };

      const res = await request(app.getHttpServer())
        .post('/users')
        .send(body)
        .expect(201);

      expect(res.body).toEqual({
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'new-user@example.com',
      });
      expect(res.body).not.toHaveProperty('password');
      expect(mockDatabaseService.user.create).toHaveBeenCalledTimes(1);
    });

    it('should reject invalid body with 400', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ first_name: 'John' })
        .expect(400);

      expect(mockDatabaseService.user.create).not.toHaveBeenCalled();
    });

    it('should reject invalid email with 400', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(mockDatabaseService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('POST /auth - Login', () => {
    it('should return user and access_token for valid credentials', async () => {
      const body = {
        email: 'john@example.com',
        password: 'password123',
      };

      const res = await request(app.getHttpServer())
        .post('/auth')
        .send(body)
        .expect(201);

      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('access_token');
      expect(res.body.user).toEqual({
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      });
      expect(res.body.user).not.toHaveProperty('password');
      expect(typeof res.body.access_token).toBe('string');
    });

    it('should return 401 for invalid credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await request(app.getHttpServer())
        .post('/auth')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should return 401 for non-existent email', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValueOnce(null);

      await request(app.getHttpServer())
        .post('/auth')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });

  describe('GET /users - List Users', () => {
    it('should return list of users without password', async () => {
      const res = await request(app.getHttpServer()).get('/users').expect(200);

      expect(res.body).toEqual([
        {
          id: 'user-1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
        },
        {
          id: 'user-2',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
        },
      ]);
      res.body.forEach((user: any) => {
        expect(user).not.toHaveProperty('password');
      });
      expect(mockDatabaseService.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /users/:id - Get User by ID', () => {
    it('should return user by id without password', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/user-1')
        .expect(200);

      expect(res.body).toEqual({
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      });
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValueOnce(null);

      await request(app.getHttpServer()).get('/users/non-existent').expect(404);
    });
  });

  describe('PATCH /users/:id - Update User', () => {
    it('should update user and return without password', async () => {
      const body = {
        first_name: 'John Updated',
      };

      const res = await request(app.getHttpServer())
        .patch('/users/user-1')
        .send(body)
        .expect(200);

      expect(res.body).toEqual({
        id: 'user-1',
        first_name: 'John Updated',
        last_name: 'Doe',
        email: 'john@example.com',
      });
      expect(res.body).not.toHaveProperty('password');
      expect(mockDatabaseService.user.update).toHaveBeenCalledTimes(1);
    });

    it('should return 404 for non-existent user', async () => {
      mockDatabaseService.user.update.mockResolvedValueOnce(null);

      await request(app.getHttpServer())
        .patch('/users/non-existent')
        .send({ first_name: 'Updated' })
        .expect(404);
    });
  });

  describe('GET /users/:id/transactions - Get User Transactions', () => {
    it('should return user transactions from wallet service', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/user-1/transactions')
        .expect(200);

      expect(res.body).toEqual([
        { id: 'tx-1', user_id: 'user-1', amount: 100, type: 'CREDIT' },
        { id: 'tx-2', user_id: 'user-1', amount: 50, type: 'DEBIT' },
      ]);
      expect(mockGetUserTransactionsUseCase.execute).toHaveBeenCalledWith('user-1');
    });

    it('should return empty array when user has no transactions', async () => {
      mockGetUserTransactionsUseCase.execute.mockResolvedValueOnce([]);

      const res = await request(app.getHttpServer())
        .get('/users/user-1/transactions')
        .expect(200);

      expect(res.body).toEqual([]);
    });
  });

  describe('DELETE /users/:id - Delete User', () => {
    it('should delete user successfully', async () => {
      const res = await request(app.getHttpServer())
        .delete('/users/user-1')
        .expect(200);

      expect(res.body).toEqual({
        message: 'Usuário deletado com sucesso',
      });
      expect(mockDatabaseService.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });
  });
});
