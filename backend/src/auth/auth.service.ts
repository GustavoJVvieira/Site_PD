import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const user = await this.usersService.findUserByEmail(email);

   
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }


    const payload = { sub: user.id, email: user.email };

    // Gera o token JWT.
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}