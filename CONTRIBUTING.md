# Contributing

Thanks for your interest in contributing to Recipe Finder! We welcome contributions of all kinds — bug reports, feature requests, documentation, localization, design tweaks, and code. This document explains how to get started and what we expect from contributors.

Quick links
- File an issue: Use the appropriate template in .github/ISSUE_TEMPLATE
- Open a PR: Use .github/PULL_REQUEST_TEMPLATE.md and follow the checklist
- Report security issues: See SECURITY.md

1) Ways to contribute
- Report bugs or request features by opening an issue. Use the provided templates.
- Contribute code via pull requests. Small, focused PRs are easiest to review.
- Improve docs: README, CONTRIBUTING, and in-app copy.
- Help with accessibility, testing, or design improvements.

2) Getting the code and running locally
(replace commands if you use yarn/pnpm)

1. Fork the repository and create a feature branch:
   - git clone git@github.com:your-username/recipe-finder.git
   - git checkout -b feat/short-description
2. Install dependencies:
   - npm install
3. Start the dev server:
   - npm run dev
4. Run tests (if present):
   - npm test

If the project has environment variables, include a sample file named .env.example with any required keys.

3) Code style & quality
- Follow the existing project style (JS/TS, ESLint, Prettier). If the repository includes configuration files, run the linters locally before opening a PR.
- Keep changes small and focused. Split large features into multiple PRs when possible.
- Write tests for bug fixes and new features. Aim for coverage around the code you change.
- Include a short description in PRs and reference related issues (e.g., fixes #123).

4) Commit messages
We follow conventional commits-style messages. Examples:
- feat(search): add ingredient filter
- fix(api): handle empty response
- docs(readme): clarify search usage

5) Pull request checklist
- [ ] I’ve read the contribution guidelines in CONTRIBUTING.md and CODE_OF_CONDUCT.md
- [ ] The PR has a clear title and description
- [ ] Related issue is referenced (if any)
- [ ] Tests added/updated where relevant
- [ ] Linting and formatting pass locally
- [ ] No sensitive data or secrets are included

6) Review process
- We aim to respond to new PRs within a few business days. Maintain good faith and patience; maintainers may ask for changes before merging.
- If your PR is large or experimental, consider opening an RFC issue or draft PR to collect feedback.

7) Non-code contributions
- Documentation improvements and translations are appreciated. Please open a PR that updates the relevant files.
- For design or UX suggestions, include mockups or screenshots.

8) Licensing
By contributing, you agree that your contributions will be licensed under the project's license (see LICENSE in the repo).

9) Questions
If you have questions about the contribution process, open an issue or contact the maintainers listed in the repository.
