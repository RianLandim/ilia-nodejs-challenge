import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
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

  beforeEach(async () => {
    createSpy = mockTransactionCreate;
    const mockDatabaseService = {
      transaction: {
        create: createSpy,
      },
    } as unknown as DatabaseService;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TransactionModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    createSpy.mockClear();
  });

  it('should accept POST /transaction and call database insert with body data', async () => {
    const body = {
      userId: 'user-123',
      amount: 100,
      type: 'CREDIT',
    };

    await request(app.getHttpServer())
      .post('/transaction')
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
      .post('/transaction')
      .send({ amount: 100, type: 'CREDIT' })
      .expect(400);

    expect(createSpy).not.toHaveBeenCalled();
  });

  it('should reject invalid type with 400', async () => {
    await request(app.getHttpServer())
      .post('/transaction')
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
      .post('/transaction')
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
});
