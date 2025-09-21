import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async register(input: RegisterInput) {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new UnauthorizedException('Email is already registered');
    }

    const user = await this.usersService.create({ ...input, role: input.role ?? Role.USER });
    return this.buildAuthPayload(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(input: LoginInput) {
    const user = await this.validateUser(input.email, input.password);
    return this.buildAuthPayload(user);
  }

  private async buildAuthPayload<T extends { id: string; role: Role; password: string }>(user: T) {
    const payload = { sub: user.id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const { password, ...safeUser } = user;
    return {
      accessToken,
      user: safeUser as Omit<T, 'password'>,
    };
  }
}
