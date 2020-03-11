import * as chai from 'chai';
// @ts-ignore
import * as dirtyChai from 'dirty-chai';
import * as chaiAsPromised from 'chai-as-promised';
// @ts-ignore
import * as sinon from 'sinon';
// @ts-ignore
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(dirtyChai);

(global as any).should = chai.should();
(global as any).sinon = sinon;
