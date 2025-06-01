type LogLevel = 'info' | 'warn' | 'error';

const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (!isProd) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (!isProd) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message: string, error?: any) => {
    if (!isProd) {
      console.error(`[ERROR] ${message}`, error);
    }
  }
};