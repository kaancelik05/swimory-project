import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Coordinates {
  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;
}

@ObjectType()
export class AffiliateLink {
  @Field(() => ID)
  id!: string;

  @Field()
  url!: string;

  @Field()
  partnerName!: string;
}

@ObjectType()
export class Location {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Coordinates)
  coordinates!: Coordinates;

  @Field(() => [String])
  images!: string[];

  @Field(() => [String])
  facilities!: string[];

  @Field(() => [AffiliateLink], { nullable: true })
  affiliateLinks?: AffiliateLink[];

  @Field(() => [String], { nullable: true })
  favoritedByIds?: string[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
