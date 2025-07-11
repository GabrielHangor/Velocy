import { open, type FileHandle } from "fs/promises";
import { LogConfig } from "./config/LogConfig.ts";
import { LOG_LEVEL, LogLevelToTextMap, type LogLevel } from "./config/options.ts";
import { checkAndCreateDir, dateTimeFormatter, getCallerInfo } from "./utils/helpers.ts";
import path from "path";

export class Logger {
  private readonly config: LogConfig;

  private logFileHandle!: FileHandle;

  constructor(config?: LogConfig) {
    this.config = config ?? new LogConfig();
  }

  async init() {
    const logDirPath = checkAndCreateDir("logs");

    const filePrefix = this.config.options.filePrefix;
    const fileName = `${filePrefix}${dateTimeFormatter.format(new Date()).replace(/[:TZ.]/g, "-")}.log`;

    this.logFileHandle = await open(path.join(logDirPath, fileName), "a+");
  }

  debug(message: string) {
    this.log(message, LOG_LEVEL.Debug);
  }

  info(message: string) {
    this.log(message, LOG_LEVEL.Info);
  }

  warn(message: string) {
    this.log(message, LOG_LEVEL.Warn);
  }

  error(message: string) {
    this.log(message, LOG_LEVEL.Error);
  }

  critical(message: string) {
    this.log(message, LOG_LEVEL.Critical);
  }

  private async log(message: string, logLevel: LogLevel) {
    if (!this.logFileHandle.fd) throw new Error("Logger is not initialized properly");

    if (logLevel < this.config.options.logLevel) return;

    await this.writeToHandle(message, logLevel);
    await this.rollingCheck();
  }

  private async writeToHandle(message: string, logLevel: LogLevel) {
    const dateTime = dateTimeFormatter.format(new Date());
    const logLevelString = LogLevelToTextMap[logLevel];
    const logMessage = `[${dateTime}] [${logLevelString}]: ${getCallerInfo()} ↪ ${message}\n`;

    await this.logFileHandle.write(logMessage);
  }

  private async rollingCheck() {
    const { sizeThreshold, timeThreshold } = this.config.options;

    const { size, birthtimeMs } = await this.logFileHandle.stat();
    const currentTime = new Date().getTime();

    const isSizeThresholdExceeded = size >= sizeThreshold;
    const isTimeThresholdExceeded = currentTime - birthtimeMs >= timeThreshold * 1000;

    if (isSizeThresholdExceeded || isTimeThresholdExceeded) {
      await this.logFileHandle.close();
      await this.init();
    }
  }
}
