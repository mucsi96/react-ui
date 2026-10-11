import { createHash } from 'node:crypto';
import { appendFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { releaseDecision } from './release-decision.ts';

const version = process.env.RELEASE_VERSION;
if (!version || !/^0\.[1-9]\d*\.0$/.test(version)) {
  throw new Error('RELEASE_VERSION must be the planned 0.<release-number>.0 version.');
}
const outputFile = process.env.GITHUB_OUTPUT;
if (!outputFile) throw new Error('GITHUB_OUTPUT is required for the release workflow.');

const packageFile = resolve(
  process.env.RELEASE_PACKAGE_DIR ?? 'release-package',
  `mucsi96-react-ui-${version}.tgz`,
);
const artifact = await readFile(packageFile);
const integrity = `sha512-${createHash('sha512').update(artifact).digest('base64')}`;
const response = await fetch(`https://registry.npmjs.org/@mucsi96%2freact-ui/${version}`, {
  headers: { Accept: 'application/json' },
  signal: AbortSignal.timeout(30_000),
});
const metadata =
  response.status === 200
    ? ((await response.json()) as { dist?: { integrity?: unknown } })
    : undefined;
const decision = releaseDecision(response.status, metadata?.dist?.integrity, integrity);
await appendFile(
  outputFile,
  `should-publish=${decision === 'publish'}\npackage-file=${packageFile}\n`,
);
console.log(
  decision === 'publish'
    ? `Ready to publish @mucsi96/react-ui@${version}.`
    : `@mucsi96/react-ui@${version} already contains this verified tarball; completing its GitHub release.`,
);
