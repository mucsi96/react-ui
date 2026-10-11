# Automated npm publishing

The initial `@mucsi96/react-ui@0.1.0` release bootstraps the package from a verified tarball using an interactive npm login. Subsequent versions are published automatically by `CI` after the verified production build and browser tests succeed on `main`, using npm trusted publishing (OIDC).

## Versioning

Automatic versions use `mucsi96/get-next-version`, checking changes in `packages/ui` against reachable `ui-*` tags. Release `ui-1` publishes `0.1.0`, `ui-2` publishes `0.2.0`, and so on. A change confined to the gallery or workspace tooling does not publish a new library version after the first release.

CI stamps the version before building and testing. The publish job downloads the exact verified npm tarball, publishes it with provenance, and creates its GitHub release/tag after npm succeeds. Pull requests build and check the candidate package but never publish. Main-branch runs are serialized so a release cannot be cancelled halfway through by a subsequent push.

If publishing succeeded but GitHub release creation failed, rerun the workflow. It recognizes an identical already-published tarball by its SHA-512 integrity, skips duplicate publication, and completes the GitHub release. Registry authentication, rate-limit, and server failures are not treated as missing packages.

## Initial bootstrap

The package must exist before npm can authorize a trusted publisher. The initial release uses the `0.1.0` tarball built and verified by CI, with the npm account authenticated locally. npm may require a browser/passkey or one-time-password approval for that first publication.

Record that publication with a GitHub release tag `ui-1` targeting the commit that produced the tarball. This makes the next library release `0.2.0` rather than attempting to reuse `0.1.0`.

The first local publication is available on [npm](https://www.npmjs.com/package/@mucsi96/react-ui) and recorded by the [ui-1 release](https://github.com/mucsi96/react-ui/releases/tag/ui-1). The package README's npm badge and trusted-publishing documentation update are a real library-package change that allows the validation MR to exercise the `0.2.0` CI release.

## Trusted publishing

Configure npm's GitHub Actions trusted publisher for the existing package:

| npm setting          | Value                                       |
| -------------------- | ------------------------------------------- |
| Provider             | GitHub Actions                              |
| Organization or user | `mucsi96`                                   |
| Repository           | `react-ui`                                  |
| Workflow filename    | `ci.yml`                                    |
| Environment name     | Leave empty                                 |
| Allowed action       | Enable direct publishing with `npm publish` |

The equivalent terminal command is:

```bash
npm trust github @mucsi96/react-ui --repo mucsi96/react-ui --file ci.yml --allow-publish --yes
```

This command may require npm's interactive 2FA approval. Verify the configuration with `npm trust list @mucsi96/react-ui`.

Enable **npm publish**, not only **npm stage publish**, in the npm website's permissions. The CI workflow performs direct publication; stage-only permission requires a separate promotion and does not authorize that command. A green verification run with a skipped publishing job does not validate the trusted publisher: an actual main-branch library release must complete.

The publish job has `id-token: write`, uses a GitHub-hosted runner, and supplies no `NODE_AUTH_TOKEN`. npm exchanges the workflow identity automatically and generates provenance. No `NPM_TOKEN` repository secret is required. npm currently requires a newly configured trusted publisher to complete its first successful publication within two days, so configure it when the next library release is ready to merge.

## Recovering and checking a release

- Rerun failed release jobs from [GitHub Actions](https://github.com/mucsi96/react-ui/actions/workflows/ci.yml). Every publication remains in CI.
- A workflow dispatch on `main` also checks for an unreleased library change and follows the complete verification pipeline.
- Check the resulting version with `npm view @mucsi96/react-ui version`.
- Check release tags and notes on [GitHub Releases](https://github.com/mucsi96/react-ui/releases).
