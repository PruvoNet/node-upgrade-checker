// eslint-disable-next-line @typescript-eslint/no-var-requires
const TestRunner = require(`jest-runner`);

class SerialRunner extends TestRunner {
  constructor(...attr) {
    super(...attr);
    this.isSerial = true;
  }
}

module.exports = SerialRunner;
