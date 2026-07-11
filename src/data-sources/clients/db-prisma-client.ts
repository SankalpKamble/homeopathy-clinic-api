import { Injectable, OnModuleInit, BeforeApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { AppLogger } from "src/app/common";

@Injectable()
export class DBPrismaClient extends PrismaClient implements OnModuleInit, BeforeApplicationShutdown {
    private readonly logger: AppLogger;

    constructor(private readonly configService: ConfigService) {
        const pool = new Pool({ connectionString: configService.get<string>('DATABASE_URL') });
        const adapter = new PrismaPg(pool);
        super({ adapter });
        this.logger = new AppLogger(DBPrismaClient.name, configService.get<string>('DB_LOG_PREFIX'));
    }

    async onModuleInit() {
        this.logger.log('Connecting to the database...');
        await this.$connect();
        this.logger.log('Connected to the database.');
    }

    async beforeApplicationShutdown(signal?: string) {
        this.logger.log(`Disconnecting from the database... Signal: ${signal}`);
        await this.$disconnect();
        this.logger.log('Disconnected from the database.');
    }
}    