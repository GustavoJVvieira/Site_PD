// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/users.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateMoedasDto } from './dto/update-moedas.dto';
import { Req } from '@nestjs/common';

interface JwtPayload {
  id: string;
  email: string;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser): Promise<UserEntity> {
    const userId = req.user.id;
    return this.usersService.findUserById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/moedas')
  updateMoedas(
    @Param('id') id: string,
    @Body() updateMoedasDto: UpdateMoedasDto,
  ): Promise<UserEntity> {
    return this.usersService.updateMoedas(id, updateMoedasDto.moedas);
  }
}
