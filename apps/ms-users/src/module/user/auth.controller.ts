import { Body, Controller, Post } from '@nestjs/common';

import { ZodValidationPipe } from '../../common/pipes/validation.pipe';
import { AuthDto, authSchema } from './dto';
import { AuthUseCase } from './usecase/auth.usecase';

@Controller('auth')
export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  @Post()
  async login(@Body(new ZodValidationPipe(authSchema)) data: AuthDto) {
    return await this.authUseCase.execute(data);
  }
}
