import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  constructor(
    context: string,
    private readonly prefix?: string,
  ) {
    super(context);
  }

  log(message: string) {
    super.log(`[${this.prefix ?? 'APP'}] ${message}`);
  }

  warn(message: string) {
    super.warn(`[${this.prefix ?? 'APP'}] ${message}`);
  }

  error(message: string, stack?: string) {
    super.error(`[${this.prefix ?? 'APP'}] ${message}`, stack);
  }

  debug(message: string) {
    super.debug(`[${this.prefix ?? 'APP'}] ${message}`);
  }

  verbose(message: string) {
    super.verbose(`[${this.prefix ?? 'APP'}] ${message}`);
  }
}
