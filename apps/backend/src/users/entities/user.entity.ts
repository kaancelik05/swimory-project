import { Field, HideField, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { Location } from '../../locations/entities/location.entity';

registerEnumType(Role, {
  name: 'Role',
  description: 'Roles supported by the Swimory platform.',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @HideField()
  password!: string;

  @Field(() => Role)
  role!: Role;

  @Field(() => [Location], { defaultValue: [] })
  favorites!: Location[];

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
