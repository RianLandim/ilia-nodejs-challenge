import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { DatabaseModule } from 'src/config/database.module';
import { TransactionModule } from '../transaction.module';
import { DatabaseService } from 'src/config/database.config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

describe('TransactionController (integration)', () => {
  let app: INestApplication;
  let createSpy: jest.Mock;

  const mockTransactionCreate = jest.fn().mockResolvedValue({
    id: 'tx-1',
    userId: 'user-123',
    amount: 100,
    type: 'CREDIT',
  });

  const mockFindMany = jest.fn().mockResolvedValue([]);

  beforeEach(async () => {
    createSpy = mockTransactionCreate;
    mockFindMany.mockResolvedValue([]);
    const mockDatabaseService = {
      transaction: {
        create: createSpy,
        findMany: mockFindMany,
      },
    } as unknown as DatabaseService;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ JWT_INTERNAL_SECRET: 'test-internal-secret' })],
        }),
        DatabaseModule,
        TransactionModule,
      ],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
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
    await app.close();
    createSpy.mockClear();
  });

  it('should accept POST /transactions and call database insert with body data', async () => {
    const body = {
      userId: 'user-123',
      amount: 100,
      type: 'CREDIT',
    };

    await request(app.getHttpServer())
      .post('/transactions')
      .send(body)
      .expect(201);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        userId: body.userId,
        amount: body.amount,
        type: body.type,
      },
    });
  });

  it('should reject invalid body (missing userId) with 400', async () => {
    await request(app.getHttpServer())
      .post('/transactions')
      .send({ amount: 100, type: 'CREDIT' })
      .expect(400);

    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should reject invalid type with 400', async () => {
    await request(app.getHttpServer())
      .post('/transactions')
      .send({ userId: 'user-1', amount: 100, type: 'INVALID' })
      .expect(400);

    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should accept DEBIT transaction and insert into database', async () => {
    const body = {
      userId: 'user-456',
      amount: 50,
      type: 'DEBIT',
    };

    await request(app.getHttpServer())
      .post('/transactions')
      .send(body)
      .expect(201);

    expect(createSpy).toHaveBeenCalledWith({
      data: {
        userId: body.userId,
        amount: body.amount,
        type: body.type,
      },
    });
  });

  it('should return list of transactions for GET /transactions (TransactionsModel shape)', async () => {
    const transactions = [
      {
        id: 'tx-1',
        userId: 'user-123',
        type: 'CREDIT' as const,
        amount: 100,
      },
      {
        id: 'tx-2',
        userId: 'user-123',
        type: 'DEBIT' as const,
        amount: 50,
      },
    ];
    mockFindMany.mockResolvedValue(transactions);

    const res = await request(app.getHttpServer())
      .get('/transactions')
      .expect(200);

    expect(res.body).toEqual([
      { id: 'tx-1', user_id: 'user-123', type: 'CREDIT', amount: 100 },
      { id: 'tx-2', user_id: 'user-123', type: 'DEBIT', amount: 50 },
    ]);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: 'user-123' },
      orderBy: { id: 'asc' },
    });
  });

  it('should filter by type when GET /transactions?type=CREDIT', async () => {
    mockFindMany.mockResolvedValue([]);

    await request(app.getHttpServer())
      .get('/transactions')
      .query({ type: 'CREDIT' })
      .expect(200);

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: 'user-123', type: 'CREDIT' },
      orderBy: { id: 'asc' },
    });
  });
});
