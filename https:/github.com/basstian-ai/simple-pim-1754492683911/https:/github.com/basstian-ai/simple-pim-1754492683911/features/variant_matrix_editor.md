# Variant Matrix Editor

## Overview
The Variant Matrix Editor allows users to manage product variants (size/color) in a grid format. Users can bulk fill, copy attributes across rows and columns, and apply pattern fills for efficient editing.

## Features
- **Grid Editing**: View and edit variant attributes in a matrix layout.
- **Bulk Copy**: Copy attributes from one variant to another across the grid.
- **Pattern Fill**: Apply a pattern fill to quickly set attributes for multiple variants.
- **Optimistic UI**: Changes are reflected immediately in the UI, with the ability to undo actions.

## User Stories
- As a merchandiser, I want to quickly edit multiple variants at once to save time.
- As a content editor, I want to ensure consistency across variant attributes without repetitive manual entry.

## Technical Details
- Implemented using React for the UI components.
- State management handled via Redux for optimal performance.
- Changes persisted atomically to ensure data integrity.