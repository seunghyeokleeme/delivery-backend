import { Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Field, ObjectType } from '@nestjs/graphql';

type UserRole = 'client' | 'owner' | 'delivery';

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column()
  @Field(() => String)
  role: UserRole;
}
