# Variant Matrix Editor

## Overview

The Variant Matrix Editor allows users to edit variant attributes in a grid format, supporting bulk copy across rows and columns, as well as pattern fills.

## Features
- Grid editing for variant attributes (size/color)
- Bulk copy functionality
- Pattern fill support
- Atomic persistence of changes with optimistic UI
- Undo functionality

## User Stories
- As a user, I want to edit multiple variant attributes at once to save time.
- As a user, I want to copy attributes from one variant to another to ensure consistency.

## Acceptance Criteria
- [ ] Users can select multiple variants and edit attributes in a grid.
- [ ] Users can copy attributes from one row to another.
- [ ] Users can fill patterns across selected rows/columns.
- [ ] Changes are persisted atomically, and users can undo changes.