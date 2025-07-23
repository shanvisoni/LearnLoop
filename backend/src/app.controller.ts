import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(['', '/']) // Handles both /api and /api/
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async health() {
    return { status: 'ok', timestamp: new Date() };
  }
}
