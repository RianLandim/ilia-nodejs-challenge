import { Injectable } from '@nestjs/common';
import { UserRepository, CreateUserData, UpdateUserData } from './user.repository';
import { DatabaseService } from 'src/config/database.config';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(data: CreateUserData) {
    return this.databaseService.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
    });
  }

  async findAll() {
    return this.databaseService.user.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: string) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.databaseService.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserData) {
    try {
      return await this.databaseService.user.update({
        where: { id },
        data: {
          ...(data.firstName && { firstName: data.firstName }),
          ...(data.lastName && { lastName: data.lastName }),
          ...(data.email && { email: data.email }),
          ...(data.password && { password: data.password }),
        },
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: string) {
    await this.databaseService.user.delete({
      where: { id },
    });
  }
}
