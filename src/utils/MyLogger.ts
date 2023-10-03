/* eslint-disable @typescript-eslint/no-explicit-any */
import { transports, format, Logger } from "winston";
import "winston-daily-rotate-file";
import path from "path";
import envConfig from "../env.config";
const { combine, timestamp, printf, colorize } = format;

const logLevel = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

const dailyRotateFileOpts = {
  dirname: path.resolve(process.cwd(), "logs"),
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "5m",
  maxFiles: "7d",
  handleExceptions: true,
  handleRejections: true,
} satisfies typeof transports.DailyRotateFileTransportOptions;

const logTransport =
  envConfig.NODE_ENV === "production"
    ? [new transports.DailyRotateFile(dailyRotateFileOpts), new transports.Console()]
    : new transports.Console();

export class MyLogger {
  private __logger: Logger;
  public label: string;

  constructor(label: string) {
    this.__logger = LoggerProvider.getInstance();
    this.label = label;
  }
  log(level: keyof typeof logLevel = "INFO", message: string, options: object): void {
    this.__logger.log(logLevel[level], message, options);
  }
  info(message: string): void {
    this.log("INFO", message, { label: this.label });
  }
  warn(message: string): void {
    this.log("WARN", message, { label: this.label });
  }
  error(message: string): void {
    this.log("ERROR", message, { label: this.label });
  }
}

class LoggerProvider extends Logger {
  private static __loggerInstance: LoggerProvider;
  private constructor() {
    super({
      transports: logTransport,
      format: combine(
        timestamp(),
        colorize(),
        printf(
          ({ level, message, label, timestamp }) =>
            `${timestamp} - [${label}] ${level}: ${message}`,
        ),
      ),
    });
  }
  static getInstance() {
    if (!this.__loggerInstance) {
      this.__loggerInstance = new this();
    }
    return this.__loggerInstance;
  }
}
