// utils/logger.ts
// Production-ready logging system

import { FEATURE_FLAGS } from '@/config/features.config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!FEATURE_FLAGS.ENABLE_LOGGING) return false;

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(FEATURE_FLAGS.LOG_LEVEL);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };
  }

  private storeLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }
  }

  private formatMessage(entry: LogEntry): string {
    let formatted = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;

    if (entry.context) {
      formatted += `\nContext: ${JSON.stringify(entry.context, null, 2)}`;
    }

    if (entry.error) {
      formatted += `\nError: ${entry.error.message}\nStack: ${entry.error.stack}`;
    }

    return formatted;
  }

  private async sendToService(entry: LogEntry): Promise<void> {
    if (!FEATURE_FLAGS.LOG_TO_SERVICE) return;

    try {
      // TODO: Implement actual logging service integration
      // Example: Sentry, LogRocket, or custom backend
      // await fetch('YOUR_LOGGING_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // });
    } catch (error) {
      // Fail silently to avoid infinite logging loops
      if (__DEV__) {
        console.error('Failed to send log to service:', error);
      }
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error);
    this.storeLog(entry);

    // Console logging (development only)
    if (FEATURE_FLAGS.LOG_TO_CONSOLE) {
      const formatted = this.formatMessage(entry);
      switch (level) {
        case 'debug':
          console.debug(formatted);
          break;
        case 'info':
          console.info(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'error':
          console.error(formatted);
          break;
      }
    }

    // Send to external service (production)
    if (FEATURE_FLAGS.LOG_TO_SERVICE) {
      this.sendToService(entry);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, context, error);
  }

  // API-specific logging
  apiRequest(method: string, url: string, data?: any): void {
    this.debug(`API Request: ${method} ${url}`, { method, url, data });
  }

  apiResponse(method: string, url: string, status: number, data?: any): void {
    this.info(`API Response: ${method} ${url} - ${status}`, { method, url, status, data });
  }

  apiError(method: string, url: string, error: Error): void {
    this.error(`API Error: ${method} ${url}`, error, { method, url });
  }

  // Redux action logging
  reduxAction(type: string, payload?: any): void {
    this.debug(`Redux Action: ${type}`, { type, payload });
  }

  // Get stored logs (useful for debugging or sending batch logs)
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Clear stored logs
  clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Convenience exports
export const log = {
  debug: (message: string, context?: Record<string, any>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, any>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, any>) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: Record<string, any>) => logger.error(message, error, context),
  apiRequest: (method: string, url: string, data?: any) => logger.apiRequest(method, url, data),
  apiResponse: (method: string, url: string, status: number, data?: any) => logger.apiResponse(method, url, status, data),
  apiError: (method: string, url: string, error: Error) => logger.apiError(method, url, error),
  reduxAction: (type: string, payload?: any) => logger.reduxAction(type, payload),
};
