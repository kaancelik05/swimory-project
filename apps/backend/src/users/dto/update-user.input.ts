import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  id!: string;

  @Field(() => Role, { nullable: true })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
