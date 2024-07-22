import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';

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
  }: CreateAccountInput): Promise<CreateAccountOutput> {
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

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.usersRepository.findOne({
        select: {
          id: true,
          password: true,
        },
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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
      });
      if (user) {
        return {
          ok: true,
          user,
        };
      }
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async editProfile(
    id: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
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
      await this.usersRepository.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not update profile' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verificationsRepository.findOne({
        where: {
          code,
        },
        relations: {
          user: true,
        },
      });

      if (verification) {
        verification.user.verified = true;
        await this.usersRepository.save(verification.user);
        return { ok: true };
      }

      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
