import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CoordinatesInput } from './coordinates.input';

@InputType()
export class AffiliateLinkInput {
  @Field()
  @IsUrl()
  url!: string;

  @Field()
  @IsString()
  partnerName!: string;
}

@InputType()
export class CreateLocationInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsString()
  description!: string;

  @Field(() => CoordinatesInput)
  @ValidateNested()
  @Type(() => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  facilities!: string[];

  @Field(() => [AffiliateLinkInput], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => AffiliateLinkInput)
  affiliateLinks?: AffiliateLinkInput[];
}
