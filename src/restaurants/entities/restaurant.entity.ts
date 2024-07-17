import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

@Entity()
@ObjectType()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Column()
  @Field(() => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Column({ default: true })
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Column()
  @Field(() => String)
  @IsString()
  address: string;

  @Column()
  @Field(() => String)
  @IsString()
  ownersName: string;

  @Column()
  @Field(() => String)
  @IsString()
  categoryName: string;
}
