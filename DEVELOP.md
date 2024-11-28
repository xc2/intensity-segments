## Requirements

- Node.js >= 18, Latest LTS is recommended.
- PNPM for managing dependencies and running scripts.

If you don't have `pnpm` installed, you can use `corepack pnpm` instead.

## Quick start

- The source code for the library is located in the `src` directory.
- The unit test cases for the source code is located in the `tests` directory.

```sh
corepack pnpm i
# Modify the source code in the `src` directory
# Run test against the modified source code
corepack pnpm test
```

## Build

We use [@rslib/core](https://lib.rsbuild.dev/) to build the library into several targets:

| Directory     | Description                                              |
|---------------|----------------------------------------------------------|
| `dist/esm`    | The ESM artifacts for Bundlers and Modern Runtimes       |
| `dist/cjs`    | The CJS artifacts for Bundlers and Modern Runtimes       |
| `dist/legacy` | The CJS artifacts for Bundlers targeting legacy runtimes |
| `dist/types`  | Types for typescript                                     |

To build the library, run:

```sh
corepack pnpm build
```

## Packaging

Packaging is the process to build the library and create the tarball for distribution.

To package the library, run:

```sh
npm pack
```

It creates the tarball file named `109cafe-intensity-segments-0.0.0-PLAHOCEHOLDER.tgz` in the root directory.

Then the tarball can be published to several repositories like GitHub Releases, NPM, etc.

> [!WARNING]
> Never publish the tarball directly with `npm publish` or `pnpm publish` commands.
> 
> See the [Publishing](#publishing) section for more details.

## Publishing

The publishing process is entirely backed by GitHub Actions.

### Canary publishing

> [!NOTE]
> This process allows you to publish against **any branch** for testing purposes.

All you need to do is to trigger the `npm-cancary` workflow manually.

The library will be published as `@canary-109cafe/intensity-segments@0.0.0-{branch}.xxx` with `{branch}` dist tag.

Add dependency `"@109cafe/intensity-sgements": "npm:@canary-109cafe/intensity-segments@{branch}"` to end project to verify the release.

### Release publishing

> [!NOTE]
> This process allows you to do packaging, verification, and publishing separately.
> 
> The Source of Truth for release version is the git tag, you don't need to update the version in `package.json`, and you should not.

The release publishing process begins with creating a new release on GitHub UI.

#### 1. Create a new release

Create a new release with a new tag named as a semver version on GitHub UI.

After creating the release, a GitHub workflow `npm-stable` will be triggered automatically to

- Build and packaging the library
- Upload the tarball to the GitHub Release

Then a job for publishing to NPM will be in pending review state for environment approvers' approval.

You can verify the tarball before approving the npm publishing job.

#### 2. Verification (optional but recommended)

Add dependency to `"@109cafe/intensity-segments": "https://<github release tarball>"` to the end project to verify the release.

If all is good, approve the publishing job.

####  3. Publishing to NPM

Navigating to the auto-triggered publishing workflow and approve the publishing job.

The library will be published as `@109cafe/intensity-segments@{git tag}` with the `latest` dist tag.

## Why

### Why `pnpm dlx` over `devDependencies`?

I'd like everyone to install as few packages as possible after cloning this repository and starting their first modification.

Packages, typically tools like 'husky,' 'lint-staged,' and 'typedoc,' are not required at this stage, so we can install them as needed.

### Why the publishing process like this?

- For "packaging once, publishing everywhere".
- `npm publish` usually fails for reason to do nothing with packaging, meanwhile the packaging process is sometimes heavily, so I separate the packaging and publishing process.

### Why versioned as `0.0.0-PLAHOCEHOLDER`?

I prefer not to add commits to the Git repository during the publishing process, whether it's automated or manual.

This helps reduce noise in the Git history and minimizes potential conflicts.

Additionally, it avoids triggering any unintended cyclical workflows.

### Why separate package names for canary and stable?

For keeping the npm registry manifest of stable package small.

The canary version might be released frequently which will increase the response size of manifest.

`npm/yarn/pnpm` fetch the manifest for installing dependencies, the larger the manifest, the slower the installation. E.g., the manifest of `@swc/core` is of 3.5MB.
