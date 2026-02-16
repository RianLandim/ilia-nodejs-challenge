import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    const users = await this.userRepository.findAll();

    return users.map((user) => ({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    }));
  }
}
