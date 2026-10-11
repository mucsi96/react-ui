# Automated npm publishing

The `CI` workflow publishes `@mucsi96/react-ui` automatically after the verified production build and browser tests succeed on `main`. The first release uses this same pipeline; no local `npm publish` is required.

## Versioning

Automatic versions use `mucsi96/get-next-version`, checking changes in `packages/ui` against reachable `ui-*` tags. Release `ui-1` publishes `0.1.0`, `ui-2` publishes `0.2.0`, and so on. A change confined to the gallery or workspace tooling does not publish a new library version after the first release.

CI stamps the version before building and testing. The publish job downloads the exact verified npm tarball, publishes it with provenance, and creates its GitHub release/tag after npm succeeds. Pull requests build and check the candidate package but never publish. Main-branch runs are serialized so a release cannot be cancelled halfway through by a subsequent push.

If publishing succeeded but GitHub release creation failed, rerun the workflow. It recognizes an identical already-published tarball by its SHA-512 integrity, skips duplicate publication, and completes the GitHub release. Registry authentication, rate-limit, and server failures are not treated as missing packages.

## First release: repository token

1. On npmjs.com, create a **granular access token** under your `mucsi96` account.
2. Set **Packages and scopes → Read and write (publish and stage)** and select the `@mucsi96` scope for creation of the initial package. Enable **Bypass two-factor authentication** for unattended CI publishing. Organization-management permissions are not needed.
3. Add the token as the **`NPM_TOKEN` repository Actions secret** in [mucsi96/react-ui settings](https://github.com/mucsi96/react-ui/settings/secrets/actions).
4. Merge the publishing workflow into `main`. Its successful verification run publishes the first version automatically. If the run failed because the secret was not configured yet, add it and rerun the failed job or dispatch `CI` on `main`.

npm tokens are scoped to npm packages/scopes, not GitHub repositories. Once the package exists, a replacement token can be limited specifically to `@mucsi96/react-ui`. Keeping `NPM_TOKEN` as a repository secret makes it available only to workflows in this repository. The token is provided only to the main-branch publish step.

## Subsequent releases: trusted publishing

After the first CI release creates the package, you can replace the token with npm's GitHub Actions trusted publisher:

| npm setting          | Value                                       |
| -------------------- | ------------------------------------------- |
| Provider             | GitHub Actions                              |
| Organization or user | `mucsi96`                                   |
| Repository           | `react-ui`                                  |
| Workflow filename    | `ci.yml`                                    |
| Environment name     | Leave empty                                 |
| Allowed action       | Enable direct publishing with `npm publish` |

Configure this in the package's npm settings before your next library release, then remove the repository's `NPM_TOKEN` secret. The publish job already has `id-token: write` and uses a GitHub-hosted runner; npm exchanges its workflow identity automatically. No workflow change is needed to switch authentication methods. npm currently requires a newly configured trusted publisher to complete its first successful publication within two days, so that next library release should occur within that window.

## Recovering and checking a release

- Rerun failed release jobs from [GitHub Actions](https://github.com/mucsi96/react-ui/actions/workflows/ci.yml). Every publication remains in CI.
- A workflow dispatch on `main` also checks for an unreleased library change and follows the complete verification pipeline.
- Check the resulting version with `npm view @mucsi96/react-ui version`.
- Check release tags and notes on [GitHub Releases](https://github.com/mucsi96/react-ui/releases).
