import { container } from '../../../src/container';
import { IEntity } from '../../../src/db/interfaces/IEntity';
import { Dependency, DependencyVersion } from '../../../src/db';
import { ISpecificCIResolver } from '../../../src/resolvers/ciResolver';
import { GithubActionsResolver } from '../../../src/resolvers/ciResolver/impl/resolvers/githubActions/githubActionsResolver';
import { CircleCiResolver } from '../../../src/resolvers/ciResolver/impl/resolvers/circleci/circleCiResolver';
import { AppVeyorResolver } from '../../../src/resolvers/ciResolver/impl/resolvers/appveyor/appVeyorResolver';
import { TravisCiResolver } from '../../../src/resolvers/ciResolver/impl/resolvers/travisci/travisCiResolver';

describe(`container`, () => {
  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it(`Should inject all entities`, () => {
    const entities = container.getAll(IEntity);
    expect(entities).toHaveLength(2);
    expect(entities).toContain(Dependency);
    expect(entities).toContain(DependencyVersion);
  });

  it(`Should inject all specific ci resolvers`, () => {
    const resolvers = container.getAll(ISpecificCIResolver);
    expect(resolvers).toHaveLength(4);
    expect(resolvers).toEqual(
      expect.arrayContaining([
        expect.any(AppVeyorResolver),
        expect.any(CircleCiResolver),
        expect.any(GithubActionsResolver),
        expect.any(TravisCiResolver),
      ])
    );
  });
});
