import { DependencyVersion } from '../../../../src/db';
// eslint-disable-next-line @typescript-eslint/quotes
import moment = require('moment');

describe(`dependencyVersion entity`, () => {
  it(`should set properties from constructor`, async () => {
    const releaseDate = moment.utc();
    const dependency = new DependencyVersion({
      version: `4.0.1`,
      name: `test dependency`,
      repoUrl: `https://www.github.com/example/test.git`,
      commitSha: `595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`,
      releaseDate,
    });
    expect(dependency.version).toBe(`4.0.1`);
    expect(dependency.name).toBe(`test dependency`);
    expect(dependency.repoUrl).toBe(`https://www.github.com/example/test.git`);
    expect(dependency.commitSha).toBe(`595e42ff-1a21-4c99-a0c9-f5ddbadbdce4`);
    expect(dependency.releaseDate.toJSON()).toBe(releaseDate.toJSON());
  });
  it(`should work with empty constructor`, async () => {
    const dependency = new DependencyVersion();
    expect(dependency.version).toBeUndefined();
    expect(dependency.name).toBeUndefined();
    expect(dependency.repoUrl).toBeUndefined();
    expect(dependency.commitSha).toBeUndefined();
    expect(dependency.releaseDate).toBeUndefined();
  });
});
