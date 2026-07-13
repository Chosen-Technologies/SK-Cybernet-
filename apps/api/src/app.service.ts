import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getHealth() {
    let dbStatus = 'up';
    let dbError = null;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error: any) {
      dbStatus = 'down';
      dbError = error.message || String(error);
    }

    return {
      status: dbStatus === 'up' ? 'ok' : 'error',
      service: 'sk-cybernet-api',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        error: dbError,
      },
    };
  }
}
