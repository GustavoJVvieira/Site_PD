// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // Injeta o JwtService
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email } = loginDto;
    const user = await this.usersService.findUserByEmail(email);

    // Cria o payload do token com informações do usuário
    const payload = { sub: user.id, email: user.email };

    // Gera o token JWT
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
