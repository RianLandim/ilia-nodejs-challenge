import { CreateTransactionDto } from '../dto';

export abstract class TransactionRepository {
  abstract createTransacation(data: CreateTransactionDto): Promise<void>;
  abstract getBalance(): Promise<void>;
}
