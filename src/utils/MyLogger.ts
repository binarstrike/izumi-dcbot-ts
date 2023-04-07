import { createLogger, transports, format, Logger } from "winston"
import { join } from "path"

const { combine, timestamp, label, printf, colorize } = format

interface ILevel {
  error: 0
  warn: 1
  info: 2
  http: 3
  verbose: 4
  debug: 5
  silly: 6
}

export default class MyLogger {
  private logger: Logger

  private readonly __format = printf(
    ({ level, message, label, timestamp }) =>
      `${timestamp} [${label}] ${level}: ${message}`
  )

  private readonly __transports =
    process.env.NODE_ENV === "production"
      ? [
          new transports.File({
            filename: join(process.cwd(), "logs/combined.log"),
          }),
          new transports.File({
            filename: join(process.cwd(), "logs/error.log"),
            level: "error",
          }),
        ]
      : new transports.Console()

  constructor(_label: string) {
    this.logger = this.__createLogger(_label)
  }
  private __createLogger(_label: string): Logger {
    return createLogger({
      transports: this.__transports,
      format: combine(
        timestamp(),
        colorize(),
        label({ label: _label }),
        this.__format
      ),
    })
  }
  public setLabel(_label: string): this {
    this.logger = this.__createLogger(_label)
    return this
  }
  public log<Level extends keyof ILevel>(level: Level, message: string): void {
    this.logger.log({ level, message })
  }
  public info(message: string): void {
    this.log("info", message)
  }
  public warn(message: string): void {
    this.log("warn", message)
  }
  public error(message: string): void {
    this.log("error", message)
  }
}
