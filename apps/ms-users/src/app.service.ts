import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

@Injectable()
export class AppService {
  // TODO: Implementar com banco de dados
  private users: User[] = [];

  createUser(data: { first_name: string; last_name: string; email: string; password: string }) {
    const existingUser = this.users.find((u) => u.email === data.email);
    if (existingUser) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'User with this email already exists',
      });
    }

    const user: User = {
      id: crypto.randomUUID(),
      ...data,
    };
    this.users.push(user);
    return this.sanitizeUser(user);
  }

  findAllUsers() {
    return { users: this.users.map(this.sanitizeUser) };
  }

  findOneUser(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }
    return this.sanitizeUser(user);
  }

  updateUser(data: Partial<User> & { id: string }) {
    const index = this.users.findIndex((u) => u.id === data.id);
    if (index === -1) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }
    this.users[index] = { ...this.users[index], ...data };
    return this.sanitizeUser(this.users[index]);
  }

  deleteUser(id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }
    this.users.splice(index, 1);
    return {};
  }

  authenticate(data: { email: string; password: string }) {
    const user = this.users.find(
      (u) => u.email === data.email && u.password === data.password,
    );
    if (!user) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Invalid credentials',
      });
    }
    // TODO: Implementar JWT real
    const access_token = Buffer.from(
      JSON.stringify({ user_id: user.id, exp: Date.now() + 3600000 }),
    ).toString('base64');

    return {
      user: this.sanitizeUser(user),
      access_token,
    };
  }

  validateToken(access_token: string) {
    try {
      const payload = JSON.parse(
        Buffer.from(access_token, 'base64').toString(),
      );
      const user = this.users.find((u) => u.id === payload.user_id);
      return {
        is_valid: !!user && payload.exp > Date.now(),
        user_id: payload.user_id || '',
      };
    } catch {
      return { is_valid: false, user_id: '' };
    }
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
  }
}
