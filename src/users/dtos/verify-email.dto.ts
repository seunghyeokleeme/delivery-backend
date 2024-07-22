import { CoreOutput } from '../../common/dtos/output.dto';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Verification } from '../entities/verification.entity';

@InputType()
export class VerifyEmailInput extends PickType(
  Verification,
  ['code'] as const,
  InputType,
) {}

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}
