// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { releaseDecision } from './release-decision.ts';

describe('release publication', () => {
  it('allows an initial publication when the version does not exist', () => {
    expect(releaseDecision(404, undefined, 'sha512-new')).toBe('publish');
  });

  it('recognizes a retry of an already-published identical tarball', () => {
    expect(releaseDecision(200, 'sha512-same', 'sha512-same')).toBe('skip');
  });

  it('rejects a version already published with different contents', () => {
    expect(() => releaseDecision(200, 'sha512-old', 'sha512-new')).toThrow(
      'different package contents',
    );
  });

  it('rejects existing versions without verifiable integrity metadata', () => {
    expect(() => releaseDecision(200, undefined, 'sha512-new')).toThrow(
      'different package contents',
    );
  });

  it.each([401, 403, 429, 500])('does not mistake HTTP %i for a missing version', (status) => {
    expect(() => releaseDecision(status, undefined, 'sha512-new')).toThrow(`HTTP ${status}`);
  });
});
