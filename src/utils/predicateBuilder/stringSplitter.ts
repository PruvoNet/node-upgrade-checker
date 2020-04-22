const quotes = new Set<string>([`"`, `'`, `\``]);
const separators = new Set<string>([` `, `,`]);
const regexPlaceholder = `/`;
const regexMatcher = /^\/(.+)\/(i)?$/i;

class Splitter {
  private idx = -1;
  private currentSequence = ``;
  private results: string[] = [];

  constructor(private readonly input: string) {}

  public split(): string[] {
    const iterationLimit = this.input.length - 1;
    while (this.idx < iterationLimit) {
      const currentChar = this.consumeNextChar();
      if (currentChar === regexPlaceholder && !this.currentSequence) {
        const closingIdx = this.getClosingIndex(currentChar, this.idx + 1);
        if (closingIdx > -1) {
          this.append(this.input.slice(this.idx, closingIdx + 1));
          this.idx = closingIdx;
        } else {
          this.append(currentChar);
        }
      } else if (quotes.has(currentChar)) {
        const pos = this.idx + 1;
        const closingIdx = this.getClosingIndex(currentChar, pos);
        if (closingIdx > -1) {
          this.append(this.input.slice(pos, closingIdx));
          this.idx = closingIdx;
        } else {
          this.append(currentChar);
        }
      } else if (separators.has(currentChar)) {
        this.break();
      } else {
        this.append(currentChar);
      }
    }
    this.break();
    return this.results;
  }

  private break(): void {
    if (this.currentSequence) {
      this.results.push(this.currentSequence);
      this.currentSequence = ``;
    }
  }

  private append(sequence: string): void {
    this.currentSequence += sequence;
  }

  private getClosingIndex(quote: string, startIdx: number): number {
    let idx = this.input.indexOf(quote, startIdx);
    if (idx > -1 && this.input[idx - 1] === `\\`) {
      idx = this.getClosingIndex(quote, idx + 1);
    }
    return idx;
  }

  private consumeNextChar(): string {
    return this.input[++this.idx];
  }
}

const regexParser = (input: string): string | RegExp => {
  const match = regexMatcher.exec(input);
  if (!match) {
    return input;
  }
  return new RegExp(match[1], match[2]);
};

export const split = (str: string | undefined): (string | RegExp)[] => {
  if (!str) {
    return [];
  }
  const splitter = new Splitter(str);
  return splitter.split().filter(Boolean).map(regexParser);
};
