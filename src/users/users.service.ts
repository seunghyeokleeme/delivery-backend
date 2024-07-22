import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificationsRepository: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exists = await this.usersRepository.findOne({
        where: {
          email,
        },
      });
      if (exists) {
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      }
      const user = await this.usersRepository.save(
        this.usersRepository.create({ email, password, role }),
      );
      await this.verificationsRepository.save(
        this.verificationsRepository.create({ user }),
      );
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: "Couldn't create account!",
      };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      // 토큰 생성
      const access_token = this.jwtService.sign({ sub: user.id });
      return {
        ok: true,
        token: access_token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async editProfile(
    id: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verificationsRepository.save(
        this.verificationsRepository.create({ user }),
      );
    }
    if (password) {
      user.password = password;
    }
    return this.usersRepository.save(user);
  }
}
