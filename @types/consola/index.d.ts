import { ConsolaLogObject, ConsolaReporter, ConsolaReporterArgs } from 'consola';
import { InspectOptions } from 'util';
import { ForegroundColor } from 'chalk';

declare module 'consola' {
  type Color = typeof ForegroundColor;

  export interface ReporterOptions {
    dateFormat?: string;
    formatOptions?: InspectOptions;
    secondaryColor?: Color;
  }

  export class FancyReporter implements ConsolaReporter {
    protected options: ReporterOptions;

    constructor(options?: ReporterOptions);

    public log(logObj: ConsolaLogObject, args: ConsolaReporterArgs): void;

    protected formatType(logObj: ConsolaLogObject): string;
  }
}
