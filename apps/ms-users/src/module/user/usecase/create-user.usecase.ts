import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    };
  }
}
