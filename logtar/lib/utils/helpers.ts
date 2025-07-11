import fs_sync from "fs";
import path from "node:path";

const CALLER_LINE_IN_STACK_TRACE = 5;

export function checkAndCreateDir(pathToDir: string) {
  const logDir = path.resolve(process.cwd(), pathToDir);

  if (!fs_sync.existsSync(logDir)) {
    fs_sync.mkdirSync(logDir, { recursive: true });
  }

  return logDir;
}

export function getCallerInfo() {
  const error = {} as Error;
  Error.captureStackTrace(error);

  const callerFrame = error.stack?.split("\n")[CALLER_LINE_IN_STACK_TRACE];
  const metaData = callerFrame?.split("at ").pop();
  return metaData;
}

export const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "short",
  timeStyle: "medium",
});
