import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<string | undefined> {
    // check new User
    try {
      const exists = await this.usersRepository.findOne({
        where: {
          email,
        },
      });

      if (exists) {
        // make error
        return 'There is a user with that email already';
      }

      await this.usersRepository.save(
        this.usersRepository.create({ email, password, role }),
      );
    } catch (e) {
      // make error
      return "Couldn't create account!";
    }
    // create user & hash the password
  }
}
