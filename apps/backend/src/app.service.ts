import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthMessage(): string {
    return 'Swimory API is running';
  }
}
