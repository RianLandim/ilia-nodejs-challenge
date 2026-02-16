import { Global, Module } from '@nestjs/common';
import { InternalGrpcMetadataService } from './services/internal-grpc-metadata.service';

@Global()
@Module({
  providers: [InternalGrpcMetadataService],
  exports: [InternalGrpcMetadataService],
})
export class CommonModule {}
