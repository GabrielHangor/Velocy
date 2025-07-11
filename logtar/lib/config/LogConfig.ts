import { LOG_LEVEL, LOG_TIME_OPTION, LOG_SIZE_OPTION, type LogLevel } from "./options.ts";

interface LogConfigOptions {
  logLevel?: LogLevel;
  filePrefix?: string;
  timeThreshold?: number;
  sizeThreshold?: number;
}

export class LogConfig {
  private readonly logLevel: LogLevel;
  private readonly filePrefix: string;
  private readonly timeThreshold: number;
  private readonly sizeThreshold: number;

  constructor(options?: LogConfigOptions) {
    const { logLevel, filePrefix, timeThreshold, sizeThreshold } = options ?? {};

    this.logLevel = logLevel ?? LOG_LEVEL.Info;
    this.filePrefix = filePrefix ?? "Logtar_";
    this.timeThreshold = timeThreshold ?? LOG_TIME_OPTION.Hourly;
    this.sizeThreshold = sizeThreshold ?? LOG_SIZE_OPTION.FiveMB;

    this.validateOptions(this.timeThreshold, this.sizeThreshold);
  }

  get options() {
    return {
      logLevel: this.logLevel,
      filePrefix: this.filePrefix,
      timeThreshold: this.timeThreshold,
      sizeThreshold: this.sizeThreshold,
    };
  }

  private validateOptions(timeThreshold: number, sizeThreshold: number) {
    if (timeThreshold < LOG_TIME_OPTION.Minutely) {
      throw new Error(`timeThreshold must be at least 60 seconds. Unsupported param: ${timeThreshold} `);
    }

    if (sizeThreshold < LOG_SIZE_OPTION.OneKB) {
      throw new Error(`sizeThreshold must be at-least 1 KB. Unsupported param ↪ ${sizeThreshold}`);
    }
  }
}
