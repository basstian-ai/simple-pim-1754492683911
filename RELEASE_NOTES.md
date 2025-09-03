# Release v0.1.0 — Initial baseline

Date: 2025-09-03

This repository's first baseline release. This file is a short, actionable release stub intended to:

- Mark a stable baseline for the project (v0.1.0).
- Provide simple, repeatable steps for creating the Git tag and a GitHub release.
- List the minimal release notes for this initial milestone.

## Highlights

- Initial project scaffold for the Recipe Finder web app (Next.js).
- MVP scope defined (search, recipe detail, favorites, about).

## Changes in this release

- Initial baseline snapshot. No production features were added/modified in this file — it simply documents the release and how to create it.

## Release steps (recommended)

1. Ensure your working tree is clean and all intended changes are committed:

   git status

2. (Optional) If your project uses package.json and you want to update package version first:

   # update package.json version without creating a git tag automatically
   npm version 0.1.0 --no-git-tag-version

3. Create an annotated Git tag locally and push it to the remote:

   git tag -a v0.1.0 -m "v0.1.0 — Initial release"
   git push origin v0.1.0

4. Create a GitHub release (choose one):

   # Using the GitHub CLI:
   gh release create v0.1.0 --title "v0.1.0" --notes-file RELEASE_NOTES.md

   # Or via the GitHub web UI: go to "Releases" → "Draft a new release", choose tag "v0.1.0", paste the notes from this file, and publish.

5. (Optional) If you need a changelog or want to include build artifacts (e.g., production build or assets), attach them to the GitHub release.

## Notes for maintainers

- This file is intentionally minimal. Expand these notes with highlights, breaking changes, migration steps, or contributors as the project evolves.
- If you adopt semantic-release or CI-driven releases later, update these instructions to reflect the automated flow.

---

Generated: 2025-09-03
