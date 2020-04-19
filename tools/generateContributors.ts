import * as fs from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
/* eslint-disable camelcase */

const IGNORED_USERS = new Set([`NUC[bot]`, `greenkeeper[bot]`, `semantic-release-bot`]);

const COMPLETELY_ARBITRARY_CONTRIBUTION_COUNT = 3;
const PAGE_LIMIT = 100;
const contributorsApiUrl = `https://api.github.com/repos/PruvoNet/node-upgrade-checker/contributors?per_page=${PAGE_LIMIT}`;

interface Contributor {
  contributions: number;
  login: string;
  url: string;
}

interface User {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
}

interface AllContributorsUser {
  login: string;
  name: string;
  avatar_url: string;
  profile: string;
  contributions: string[];
}

async function* fetchUsers(page = 1): AsyncIterableIterator<Contributor[]> {
  let lastLength = 0;
  do {
    const response = await fetch(`${contributorsApiUrl}&page=${page}`, {
      method: `GET`,
    });
    const contributors: Contributor[] | { message: string } = await response.json();

    if (!Array.isArray(contributors)) {
      throw new Error(contributors.message);
    }
    const thresholdContributors = contributors.filter(
      (user) => user.contributions >= COMPLETELY_ARBITRARY_CONTRIBUTION_COUNT
    );
    yield thresholdContributors;
    lastLength = thresholdContributors.length;
    page++;
  } while (lastLength === PAGE_LIMIT);
}

const main = async (): Promise<void> => {
  const githubContributors: Contributor[] = [];
  for await (const lastUsers of fetchUsers()) {
    githubContributors.push(...lastUsers);
  }
  const users = await Promise.all(
    githubContributors.map<Promise<User>>(async (contributor) => {
      const response = await fetch(contributor.url, { method: `GET` });
      return response.json();
    })
  );
  const contributors = users
    .filter((u) => !IGNORED_USERS.has(u.login))
    .map<AllContributorsUser>((user) => {
      return {
        login: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url, // eslint-disable-line @typescript-eslint/camelcase
        profile: user.html_url,
        contributions: [],
      };
    });

  const allContributorsConfig = {
    projectName: `node-upgrade-checker`,
    projectOwner: `PruvoNet`,
    repoType: `github`,
    repoHost: `https://github.com`,
    files: [`CONTRIBUTORS.md`],
    imageSize: 100,
    commit: false,
    contributors,
    contributorsPerLine: 5,
  };
  const rcPath = path.resolve(__dirname, `../.all-contributorsrc`);
  fs.writeFileSync(rcPath, JSON.stringify(allContributorsConfig, null, 2));
};

main().then(() => {
  console.log(`done`);
});
