// Frontend logging utility for user story 1 operations

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: any;
}

class Logger {
  private logs: LogEntry[] = [];

  info(message: string, context?: any) {
    this.log('info', message, context);
  }

  warn(message: string, context?: any) {
    this.log('warn', message, context);
  }

  error(message: string, context?: any) {
    this.log('error', message, context);
  }

  private log(level: 'info' | 'warn' | 'error', message: string, context?: any) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };

    this.logs.push(logEntry);

    // Also log to console
    switch (level) {
      case 'info':
        console.log(`[INFO] ${message}`, context);
        break;
      case 'warn':
        console.warn(`[WARN] ${message}`, context);
        break;
      case 'error':
        console.error(`[ERROR] ${message}`, context);
        break;
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs]; // Return a copy
  }

  clearLogs() {
    this.logs = [];
  }
}

export default new Logger();