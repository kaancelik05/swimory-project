import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { description: 'List all Swimory users ordered by recency.' })
  users() {
    return this.usersService.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input);
  }

  @Mutation(() => User)
  updateUser(@Args('input') input: UpdateUserInput) {
    return this.usersService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.remove(id);
  }

  @Mutation(() => User)
  updateUserRole(
    @Args('id', { type: () => ID }) id: string,
    @Args('role', { type: () => Role }) role: Role,
  ) {
    return this.usersService.updateRole(id, role);
  }

  @Mutation(() => User)
  toggleFavorite(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('locationId', { type: () => ID }) locationId: string,
    @Args('favorite', { type: () => Boolean }) favorite: boolean,
  ) {
    return this.usersService.toggleFavorite(userId, locationId, favorite);
  }
}
