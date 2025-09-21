import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Location } from './entities/location.entity';
import { LocationsService } from './locations.service';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query(() => [Location])
  locations() {
    return this.locationsService.findAll();
  }

  @Query(() => Location)
  location(@Args('id', { type: () => ID }) id: string) {
    return this.locationsService.findOne(id);
  }

  @Mutation(() => Location)
  createLocation(@Args('input') input: CreateLocationInput) {
    return this.locationsService.create(input);
  }

  @Mutation(() => Location)
  updateLocation(@Args('input') input: UpdateLocationInput) {
    return this.locationsService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  removeLocation(@Args('id', { type: () => ID }) id: string) {
    return this.locationsService.remove(id);
  }
}
