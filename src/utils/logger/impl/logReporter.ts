// @ts-ignore
import { ConsolaReporter, FancyReporter } from 'consola';
// eslint-disable-next-line @typescript-eslint/quotes
import chalk = require('chalk');

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

export class LogReporter extends FancyReporter implements ConsolaReporter {
  constructor(options?: any) {
    super(options);
  }

  protected formatType(logObj: any): string {
    // @ts-ignore
    const typeColor = LEVEL_COLOR_MAP[logObj.level] || this.options.secondaryColor;
    return chalkBgColor(typeColor).black(` ${logObj.type.toUpperCase()} `);
  }

  public log(...args: any[]): void {
    super.log.apply(this, args);
  }
}
