import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AppLogger } from "src/app/common/";

@Injectable()
export class AuthGuard {
    private supabase: SupabaseClient;
    private readonly logger: AppLogger;

    constructor(private readonly configService: ConfigService) {
        this.supabase = createClient(
            configService.get<string>('SUPABASE_URL')!,
            configService.get<string>('SUPABASE_PUBLISHABLE_KEY')!,
        );
        this.logger = new AppLogger(AuthGuard.name, configService.get<string>('GUARD_LOG_PREFIX'));
    }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        
        if (!token) {
            this.logger.warn('Token missing from Authorization header');
            throw new UnauthorizedException('Authorization token is missing or invalid');
        }

        const { data: { user }, error } = await this.supabase.auth.getUser(token);

        if (error || !user) {
            this.logger.warn(`Token verification failed: ${error?.message ?? 'No user returned'}`);
            throw new UnauthorizedException('Invalid token');
        }

        this.logger.log(`Token verified for user: ${user.email}`);
        (request as any).user = user;
        return true;
    }

    private extractToken(request: Request): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.split(' ')[1];
    }
}