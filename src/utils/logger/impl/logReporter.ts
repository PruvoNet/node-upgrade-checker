import { ConsolaLogObject, ConsolaReporter, FancyReporter, FancyReporterOptions } from 'consola';
import chalk = require('chalk');
import * as figures from 'figures';
import type { Chalk, BackgroundColor, ForegroundColor } from 'chalk';
import { Nullable } from 'Union/Nullable';
import { isNumber } from 'ts-type-guards';

const bgColorCache: Record<string, Chalk> = {};

const chalkBgColor = (name: BGColor): Chalk => {
  if (!bgColorCache[name]) {
    bgColorCache[name] = chalk[name];
  }
  return bgColorCache[name];
};

const LEVEL_COLOR_MAP: Record<number, Nullable<BGColor>> = {
  0: `bgRed`,
  1: `bgYellow`,
  2: `bgWhite`,
  3: `bgGreen`,
};

const TYPE_COLOR_MAP: Record<string, Nullable<BGColor>> = {
  info: `bgBlue`,
};

const TYPE_ICONS: Record<string, Nullable<string>> = {
  info: figures(`ℹ`),
  success: figures(`✔`),
  error: figures(`✖`),
  warn: figures(`Ⓘ`),
};

export type BGColor = typeof BackgroundColor;
export type Color = typeof ForegroundColor;

export interface LogReporterOptions extends FancyReporterOptions {
  secondaryColor: Color;
  bgColor: BGColor;
}

export class LogReporter extends FancyReporter implements ConsolaReporter {
  private bgColor: BGColor;
  constructor(options: LogReporterOptions) {
    super(options);
    this.bgColor = options.bgColor;
  }

  protected formatType(logObj: ConsolaLogObject): string {
    const typeColor =
      (logObj.type && TYPE_COLOR_MAP[logObj.type]) ||
      (isNumber(logObj.level) && LEVEL_COLOR_MAP[logObj.level]) ||
      this.bgColor;
    const typeIcon = logObj.type && TYPE_ICONS[logObj.type];
    const text = ` ${typeIcon || (logObj.type && logObj.type.toUpperCase())} `;
    return chalkBgColor(typeColor).black(text);
  }
}
