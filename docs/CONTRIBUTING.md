# Contributing & Documentation Guide

Thanks for helping improve the Recipe Finder project! This document explains how we manage documentation and the changelog so contributors and maintainers have a simple, predictable workflow.

Principles
- Keep user-facing docs and changelog entries clear and concise.
- Record changes in CHANGELOG.md under the "Unreleased" heading before or during development so reviewers can see intent.
- Small, focused PRs are easier to review.

Changelog workflow
1. When you start work that changes behavior or adds a feature, add a short entry under the appropriate category in CHANGELOG.md > Unreleased. Use a single-line description and reference an issue/PR number if available.

   Example:
   ### Added
   - Add lightweight favorites storage in localStorage (#45)

2. Work on your branch and open a PR. Keep the changelog entry updated if the scope changes.
3. Once the PR is merged and you're preparing a release, the maintainer will move the Unreleased entries into a versioned heading with the release date.

Categories
- Added: for new features
- Changed: for updates to existing functionality
- Deprecated: for soon-to-be-removed features
- Removed: for removed features
- Fixed: for bug fixes
- Security: in case of security fixes

Docs updates
- If you update public behavior (APIs, UI changes), update README.md or other docs that explain that behavior.
- For purely internal docs (notes, TODOs), place them under docs/ and keep them scoped to maintainers.

Commit & PR messages
- Use concise, conventional-style commit messages (optional but helpful):
  - feat: add ...
  - fix: correct ...
  - docs: update ...
  - chore: bump deps

Review checklist for documentation changes
- Is the change user-facing? If so, add/update README.md and CHANGELOG.md.
- Is the language clear to a new contributor or user?
- Are external links (TheMealDB, guides) valid?

Maintainer notes
- Keep the top of CHANGELOG.md focused with an "Unreleased" section.
- For releases: add a new section like `## [1.0.0] - YYYY-MM-DD` and move entries from Unreleased under it.

Contact
- If something is unclear, open an issue or a small PR describing the problem and a proposed fix.