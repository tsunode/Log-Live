import { createLogger, transports, format, config } from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";
import {randomUUID} from 'node:crypto'


const { colorize, simple, combine, timestamp, prettyPrint, printf } = format;

const customFormat = printf(({level, message, timestamp, ...metadata }) => {
    const logMessage = `[${level} | ${timestamp}]: ${message}`;
    const symbolSplat = Symbol.for('splat');
    const metadataSplat = metadata[symbolSplat];

    const hasKeysInMetadaSplat = metadataSplat ? !!Object.keys(metadataSplat).length : false;

    if(hasKeysInMetadaSplat) {
        return `${logMessage} \n ${JSON.stringify(metadataSplat, null, 2)}`
    }

    return logMessage;
});

const customFormatGoogle = format(({level, message, ...metadata}) => {
    const symbolSplat = Symbol.for('splat');
    const metadataSplat = metadata[symbolSplat];
    const hasKeysInMetadataSplat = metadataSplat && !!Object.keys(metadataSplat).length;
  
    if (hasKeysInMetadataSplat) {
      return { level, message, ...metadataSplat };
    }
  
  
    return {level, message};
});

const loggingWinstonGCP = new LoggingWinston({
    prefix: 'Live Tsunode',
    levels: config.syslog.levels,
    format: customFormatGoogle()
})

export const Logger = createLogger({
    level: process.env.LOG_LEVEL,
    levels: config.syslog.levels,
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                customFormat
                // simple(),
                // prettyPrint(),
            )
        }),
        loggingWinstonGCP
    ]
});

type Levels = 'emerg' | 'alert' | 'crit' | 'error' | 'warning' | 'notice' | 'info' | 'debug';
type LevelFunction = (message: string, ...details: unknown[]) => void;
type LogFunction = (level: string, message: string, ...details:unknown[]) => void;
type LevelsFunctions = Record<Levels, LevelFunction>;
type RecordLevelsFunction = Partial<LevelsFunctions> & { log: LogFunction }

export const createCustomLogger = (id = randomUUID()) => {
  const loggerObj: RecordLevelsFunction = {
    log(level: string, message: string, ...details: unknown[]) {
      Logger.log(level, `[${id}] ${message}`, ...details);
    },
  };

  const keys = Object.keys(config.syslog.levels) as Levels[];

  keys.forEach((key) => {
    loggerObj[key] = function (message: string, ...details: unknown[]) {
      if(this.log) {
        this.log(key, message, ...details);
      }
    };
  });

  return loggerObj as Required<typeof loggerObj>;
}