import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    };
  }
}
