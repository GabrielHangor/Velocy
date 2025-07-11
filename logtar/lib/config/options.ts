export const LOG_LEVEL = {
  Debug: 0,
  Info: 1,
  Warn: 2,
  Error: 3,
  Critical: 4,
} as const;

export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

export const LogLevelToTextMap = {
  [LOG_LEVEL.Debug]: "DEBUG",
  [LOG_LEVEL.Info]: "INFO",
  [LOG_LEVEL.Warn]: "WARN",
  [LOG_LEVEL.Error]: "ERROR",
  [LOG_LEVEL.Critical]: "CRITICAL",
} as const;

export const LOG_SIZE_OPTION = {
  OneKB: 1024,
  FiveKB: 5 * 1024,
  TenKB: 10 * 1024,
  TwentyKB: 20 * 1024,
  FiftyKB: 50 * 1024,
  HundredKB: 100 * 1024,
  HalfMB: 512 * 1024,
  OneMB: 1024 * 1024,
  FiveMB: 5 * 1024 * 1024,
  TenMB: 10 * 1024 * 1024,
  TwentyMB: 20 * 1024 * 1024,
  FiftyMB: 50 * 1024 * 1024,
  HundredMB: 100 * 1024 * 1024,
} as const;

export const LOG_TIME_OPTION = {
  Minutely: 60,
  Hourly: 60 * 60,
  Daily: 24 * (60 * 60),
  Weekly: 7 * (24 * 60 * 60),
  Monthly: 30 * (24 * 60 * 60),
  Yearly: 12 * (30 * 24 * 60 * 60),
} as const;
