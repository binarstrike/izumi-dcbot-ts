/* eslint-disable @typescript-eslint/no-explicit-any */
import { transports, format, Logger } from "winston";
import "winston-daily-rotate-file";
import path from "path";
const { combine, timestamp, printf, colorize } = format;

type LogLevel = "info" | "warn" | "error";

const dailyRotateFileOpts: typeof transports.DailyRotateFileTransportOptions = {
  dirname: path.resolve(process.cwd(), "logs"),
  filename: "%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "5m",
  maxFiles: "7d",
  handleExceptions: true,
  handleRejections: true,
};

const logTransport =
  process.env.NODE_ENV === "production"
    ? [new transports.DailyRotateFile(dailyRotateFileOpts), new transports.Console()]
    : new transports.Console();

export class MyLogger {
  private __logger: Logger;
  public label: string;

  constructor(label: string) {
    this.__logger = LoggerProvider.getInstance();
    this.label = label;
  }
  log(level: LogLevel, message: string, options: object): void {
    this.__logger.log(level, message, options);
  }
  info(message: string): void {
    this.log("info", message, { label: this.label });
  }
  warn(message: string): void {
    this.log("warn", message, { label: this.label });
  }
  error(message: string): void {
    this.log("error", message, { label: this.label });
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

export function newLogger(label: string): MyLogger {
  return new MyLogger(label);
}
