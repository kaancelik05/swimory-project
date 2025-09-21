import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(8)
  password!: string;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  role?: Role;
}
