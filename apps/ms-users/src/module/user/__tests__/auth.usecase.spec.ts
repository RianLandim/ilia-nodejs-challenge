import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUseCase } from '../usecase/auth.usecase';
import { UserRepository } from '../repository/user.repository';
import { AuthDto } from '../dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthUseCase', () => {
  let useCase: AuthUseCase;
  let repository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const validDto: AuthDto = {
    email: 'john@example.com',
    password: 'password123',
  };

  const mockUser = {
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    const mockRepository: Partial<jest.Mocked<UserRepository>> = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
    };

    const mockJwtService: Partial<jest.Mocked<JwtService>> = {
      sign: jest.fn().mockReturnValue('jwt-token-123'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUseCase,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    useCase = module.get(AuthUseCase);
    repository = module.get(UserRepository);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  it('should return user and access_token for valid credentials', async () => {
    const result = await useCase.execute(validDto);

    expect(repository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 'user-123',
      email: 'john@example.com',
    });
    expect(result).toEqual({
      user: {
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      },
      access_token: 'jwt-token-123',
    });
    expect(result.user).not.toHaveProperty('password');
  });

  it('should throw UnauthorizedException if email does not exist', async () => {
    repository.findByEmail.mockResolvedValueOnce(null);

    await expect(useCase.execute(validDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(useCase.execute(validDto)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.sign).not.toHaveBeenCalled();
  });
});
