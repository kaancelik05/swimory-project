import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String, { description: 'Health check query for the Swimory API.' })
  apiHealth(): string {
    return this.appService.getHealthMessage();
  }
}
