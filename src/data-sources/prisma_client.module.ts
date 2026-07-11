import { Global, Module } from "@nestjs/common";
import * as clients from "./clients";

@Global()
@Module({
    providers: [...Object.values(clients)],
    exports: [...Object.values(clients)],
})
export class PrismaClientModule {}