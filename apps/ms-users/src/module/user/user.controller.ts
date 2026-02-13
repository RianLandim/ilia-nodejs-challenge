import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/validation.pipe';
import {
  CreateUserDto,
  createUserSchema,
  UpdateUserDto,
  updateUserSchema,
} from './dto';
import { CreateUserUseCase } from './usecase/create-user.usecase';
import { ListUsersUseCase } from './usecase/list-users.usecase';
import { GetUserUseCase } from './usecase/get-user.usecase';
import { UpdateUserUseCase } from './usecase/update-user.usecase';
import { DeleteUserUseCase } from './usecase/delete-user.usecase';

@Controller('users')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private listUsersUseCase: ListUsersUseCase,
    private getUserUseCase: GetUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  async create(@Body(new ZodValidationPipe(createUserSchema)) data: CreateUserDto) {
    return await this.createUserUseCase.execute(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list() {
    return await this.listUsersUseCase.execute();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string) {
    return await this.getUserUseCase.execute(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) data: UpdateUserDto,
  ) {
    return await this.updateUserUseCase.execute(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    await this.deleteUserUseCase.execute(id);
    return { message: 'Usuário deletado com sucesso' };
  }
}
