import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(8)
  password!: string;

  @Field(() => Role, { defaultValue: Role.USER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.USER;
}
