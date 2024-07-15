import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field()
  @IsString()
  @Length(5, 10)
  name: string;

  @Field()
  @IsBoolean()
  isVegan: boolean;

  @Field()
  @IsString()
  address: string;

  @Field()
  @IsString()
  ownersName: string;
}
