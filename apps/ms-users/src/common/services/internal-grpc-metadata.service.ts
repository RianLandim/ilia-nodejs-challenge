import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Metadata } from '@grpc/grpc-js';
import * as jwt from 'jsonwebtoken';

/**
 * Serviço que cria Metadata para chamadas gRPC internas entre microserviços,
 * incluindo o JWT interno no header Authorization.
 * Pode ser reutilizado em qualquer use case ou serviço que precise chamar
 * outros microserviços com autenticação interna.
 */
@Injectable()
export class InternalGrpcMetadataService {
  private readonly internalSecret: string;
  private readonly tokenExpiresIn = '30s';

  constructor(private readonly configService: ConfigService) {
    this.internalSecret = this.configService.getOrThrow<string>(
      'JWT_INTERNAL_SECRET',
    );
  }

  /**
   * Cria um Metadata com Bearer token JWT interno para o userId informado.
   * Use o retorno em chamadas gRPC que exigem autenticação interna.
   */
  createMetadataForUser(userId: string): Metadata {
    const token = jwt.sign({ sub: userId }, this.internalSecret, {
      expiresIn: this.tokenExpiresIn,
    });
    const metadata = new Metadata();
    metadata.add('authorization', `Bearer ${token}`);
    return metadata;
  }
}
