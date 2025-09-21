import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CreateLocationInput } from './create-location.input';
import { CoordinatesInput } from './coordinates.input';

@InputType()
export class UpdateLocationInput extends PartialType(CreateLocationInput) {
  @Field(() => ID)
  id!: string;

  @Field(() => CoordinatesInput, { nullable: true })
  @IsOptional()
  coordinates?: CoordinatesInput;
}
