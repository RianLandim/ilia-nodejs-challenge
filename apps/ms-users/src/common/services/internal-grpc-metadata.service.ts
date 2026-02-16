import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Metadata } from '@grpc/grpc-js';
import * as jwt from 'jsonwebtoken';

/**
 * Service that creates Metadata for internal gRPC calls between microservices,
 * including the internal JWT in the Authorization header.
 * Can be reused in any use case or service that needs to call other
 * microservices with internal authentication.
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
   * Creates Metadata with an internal JWT Bearer token for the given userId.
   * Use the return value in gRPC calls that require internal authentication.
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
