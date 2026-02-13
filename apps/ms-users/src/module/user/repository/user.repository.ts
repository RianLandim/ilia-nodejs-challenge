import type { UserModel } from '../../../database/generated/prisma/models/User';

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UpdateUserData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

export abstract class UserRepository {
  abstract create(data: CreateUserData): Promise<UserModel>;
  abstract findAll(): Promise<UserModel[]>;
  abstract findById(id: string): Promise<UserModel | null>;
  abstract findByEmail(email: string): Promise<UserModel | null>;
  abstract update(id: string, data: UpdateUserData): Promise<UserModel | null>;
  abstract delete(id: string): Promise<void>;
}
