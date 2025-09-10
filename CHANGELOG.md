# Changelog

All notable changes to this project will be documented in this file.

This project adheres to "Keep a Changelog" and uses semantic, categorized entries to make releases and reviews easier.

Format
- Each change should be added under the "Unreleased" section while the work is ongoing.
- When cutting a release, move entries from "Unreleased" to a versioned section with the release date.
- Categories: Added, Changed, Deprecated, Removed, Fixed, Security

## [Unreleased]

### Added
- Consolidated documentation and contribution guidelines (docs/CONTRIBUTING.md).
- Initial changelog file to track user-visible changes.

### Added (MVP)
- Homepage with search and trending recipes
- Recipe detail pages with ingredients, instructions, and images
- Favorites page persisted to localStorage
- About page describing the project

---

## [0.1.0] - 2025-09-10
### Added
- Project scaffold and MVP features (homepage, search, recipe details, favorites, about).


---

How to use this file
- For contributors: add a short entry under "Unreleased" describing the change and use one of the categories above.
- For maintainers: when creating a release, replace the "Unreleased" header with the new version and release date, and create a new empty "Unreleased" section at the top.

Example entry:

## [Unreleased]

### Fixed
- Fix image aspect ratio in recipe cards (#123)

Notes
- Keep entries concise and focused on user-visible behavior. Internal refactors can be omitted unless they affect the user or APIs.