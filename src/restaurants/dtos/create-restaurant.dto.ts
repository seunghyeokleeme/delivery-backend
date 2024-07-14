import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateRestaurantDto {
  @Field()
  name: string;

  @Field()
  isVegan: boolean;

  @Field()
  address: string;

  @Field()
  ownersName: string;
}
