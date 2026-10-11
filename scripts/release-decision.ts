export function releaseDecision(
  status: number,
  publishedIntegrity: unknown,
  artifactIntegrity: string,
): 'publish' | 'skip' {
  if (status === 404) return 'publish';
  if (status !== 200) throw new Error(`npm registry lookup failed (HTTP ${status}).`);
  if (publishedIntegrity !== artifactIntegrity) {
    throw new Error('This npm version already exists with different package contents.');
  }
  return 'skip';
}
