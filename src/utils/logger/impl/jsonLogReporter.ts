import { BasicReporter, BasicReporterOptions, ConsolaLogObject, ConsolaReporter } from 'consola';

export interface JsonLogReporterOptions extends BasicReporterOptions {
  stream: NodeJS.WritableStream;
}

export class JsonLogReporter extends BasicReporter implements ConsolaReporter {
  private readonly stream: NodeJS.WritableStream;

  constructor(options: JsonLogReporterOptions) {
    super(options);
    this.stream = options.stream;
  }

  public log(logObj: ConsolaLogObject): void {
    const message = this.formatArgs(logObj.args || []); // TODO fix that after consola typings are fixed
    this.stream.write(
      `${JSON.stringify({
        message,
        level: logObj.level,
        type: logObj.type,
        tag: logObj.tag || undefined,
        date: logObj.date,
      })}\n`
    );
  }
}
