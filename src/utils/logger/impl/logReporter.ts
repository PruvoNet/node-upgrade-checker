// @ts-ignore
import { ConsolaLogObject, ConsolaReporter, ConsolaReporterArgs, FancyReporter } from 'consola';
import chalk = require('chalk');
import * as figures from 'figures';

const bgColorCache: any = {};

const chalkBgColor = (name: string): any => {
  let color = bgColorCache[name];
  if (color) {
    return color;
  }
  // @ts-ignore
  color = chalk[`bg${name[0].toUpperCase()}${name.slice(1)}`];
  bgColorCache[name] = color;
  return color;
};

const LEVEL_COLOR_MAP = {
  0: `red`,
  1: `yellow`,
  2: `white`,
  3: `green`,
};

const TYPE_COLOR_MAP = {
  info: `blue`,
};

const TYPE_ICONS = {
  info: figures(`ℹ`),
  success: figures(`✔`),
  error: figures(`✖`),
  warn: figures(`Ⓘ`),
};

export class LogReporter extends FancyReporter implements ConsolaReporter {
  constructor(options?: any) {
    super(options);
  }

  protected formatType(logObj: any): string {
    // @ts-ignore
    const typeColor = TYPE_COLOR_MAP[logObj.type] || LEVEL_COLOR_MAP[logObj.level] || this.options.secondaryColor;
    // @ts-ignore
    const typeIcon = TYPE_ICONS[logObj.type];
    const text = ` ${typeIcon || logObj.type.toUpperCase()} `;
    return chalkBgColor(typeColor).black(text);
  }

  public log(logObj: ConsolaLogObject, args: ConsolaReporterArgs): void {
    super.log(logObj, args);
  }
}
