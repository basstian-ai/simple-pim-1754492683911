# Variant Matrix Editor

## Overview
The Variant Matrix Editor allows users to edit variant attributes such as size and color in a grid format. Users can perform bulk copy across rows and columns, as well as apply pattern fills.

## Features
- Grid editing for variant attributes
- Bulk copy functionality
- Pattern fill support
- Atomic persistence of changes
- Optimistic UI with undo capability

## User Stories
1. As a user, I want to edit multiple variant attributes at once to save time.
2. As a user, I want to copy attributes from one variant to another to maintain consistency.
3. As a user, I want to fill attributes in a pattern to quickly set up variants.

## Acceptance Criteria
- [ ] The grid displays all variants and their attributes.
- [ ] Users can select multiple cells to copy values.
- [ ] Users can apply pattern fills across selected cells.
- [ ] Changes are persisted atomically.
- [ ] Users can undo their last action.