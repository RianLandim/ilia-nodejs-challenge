import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';
import { USERS_SERVICE_NAME } from '@ilia/grpc';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod(USERS_SERVICE_NAME, 'CreateUser')
  createUser(data: any) {
    return this.appService.createUser(data);
  }

  @GrpcMethod(USERS_SERVICE_NAME, 'FindAllUsers')
  findAllUsers() {
    return this.appService.findAllUsers();
  }

  @GrpcMethod(USERS_SERVICE_NAME, 'FindOneUser')
  findOneUser(data: { id: string }) {
    return this.appService.findOneUser(data.id);
  }

  @GrpcMethod(USERS_SERVICE_NAME, 'UpdateUser')
  updateUser(data: any) {
    return this.appService.updateUser(data);
  }

  @GrpcMethod(USERS_SERVICE_NAME, 'DeleteUser')
  deleteUser(data: { id: string }) {
    return this.appService.deleteUser(data.id);
  }

  @GrpcMethod(USERS_SERVICE_NAME, 'Authenticate')
  authenticate(data: { email: string; password: string }) {
    return this.appService.authenticate(data);
  }

  @GrpcMethod(USERS_SERVICE_NAME, 'ValidateToken')
  validateToken(data: { access_token: string }) {
    return this.appService.validateToken(data.access_token);
  }
}
