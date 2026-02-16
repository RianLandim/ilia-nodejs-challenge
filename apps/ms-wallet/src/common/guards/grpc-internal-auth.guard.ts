import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GrpcInternalAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const metadata = context.switchToRpc().getContext();
    const internalMap = metadata?.internalRepr || metadata?.getMap?.() || {};

    let token: string | undefined;

    if (metadata?.get) {
      const authValues = metadata.get('authorization');
      if (authValues && authValues.length > 0) {
        token = String(authValues[0]).replace('Bearer ', '');
      }
    }

    if (!token) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Token interno não fornecido',
      });
    }

    try {
      const secret = this.configService.getOrThrow<string>('JWT_INTERNAL_SECRET');
      jwt.verify(token, secret);
      return true;
    } catch {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Token interno inválido',
      });
    }
  }
}
