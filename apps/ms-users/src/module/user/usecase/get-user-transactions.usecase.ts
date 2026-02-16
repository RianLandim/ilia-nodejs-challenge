import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { GRPC_WALLET_CLIENT, WALLET_SERVICE_NAME } from '@ilia/grpc';
import { Observable, lastValueFrom } from 'rxjs';
import { InternalGrpcMetadataService } from '../../../common/services/internal-grpc-metadata.service';

interface TransactionResponse {
  id: string;
  userId: string;
  amount: number;
  type: number;
}

interface TransactionListResponse {
  transactions: TransactionResponse[];
}

interface FindAllTransactionsRequest {
  userId: string;
  type?: number;
}

interface WalletServiceGrpc {
  findAllTransactions(
    data: FindAllTransactionsRequest,
    metadata: Metadata,
  ): Observable<TransactionListResponse>;
}

const TYPE_MAP: Record<number, string> = {
  0: 'CREDIT',
  1: 'DEBIT',
};

@Injectable()
export class GetUserTransactionsUseCase implements OnModuleInit {
  private walletService!: WalletServiceGrpc;

  constructor(
    @Inject(GRPC_WALLET_CLIENT) private readonly client: ClientGrpc,
    private readonly internalGrpcMetadata: InternalGrpcMetadataService,
  ) {}

  onModuleInit() {
    this.walletService =
      this.client.getService<WalletServiceGrpc>(WALLET_SERVICE_NAME);
  }

  async execute(userId: string) {
    const metadata = this.internalGrpcMetadata.createMetadataForUser(userId);

    const response = await lastValueFrom(
      this.walletService.findAllTransactions({ userId }, metadata),
    );

    return (response.transactions || []).map((t) => ({
      id: t.id,
      user_id: t.userId,
      amount: t.amount,
      type: TYPE_MAP[t.type] || 'CREDIT',
    }));
  }
}
