import { container } from '../../../src/container';
import { IEntity } from '../../../src/db/interfaces/IEntity';
import { Dependency, DependencyVersion } from '../../../src/db';
import { ISpecificCIResolver } from '../../../src/resolvers/ciResolver';
import { TravisCiResolver } from '../../../src/resolvers/ciResolver/impl/resolvers/travis';
import { GithubActionsResolver } from '../../../src/resolvers/ciResolver/impl/resolvers/github';
import { CircleCiResolver } from '../../../src/resolvers/ciResolver/impl/resolvers/circle';
import { AppVeyorResolver } from '../../../src/resolvers/ciResolver/impl/resolvers/appveyor';

describe(`container`, () => {
  beforeEach(() => {
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it(`Should inject all entities`, () => {
    const entities = container.getAll(IEntity);
    expect(entities.length).toBe(2);
    expect(entities).toContain(Dependency);
    expect(entities).toContain(DependencyVersion);
  });

  it(`Should inject all specific ci resolvers`, () => {
    const entities = container.getAll(ISpecificCIResolver);
    expect(entities).toHaveLength(4);
    expect(entities).toEqual(
      expect.arrayContaining([
        expect.any(AppVeyorResolver),
        expect.any(CircleCiResolver),
        expect.any(GithubActionsResolver),
        expect.any(TravisCiResolver),
      ])
    );
  });
});
