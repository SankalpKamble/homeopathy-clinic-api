import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const User = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userData = (request as any).user;
    if (!userData) {
        throw new Error('User information is missing from request');
    }
    return data ? userData[data] : userData;
});