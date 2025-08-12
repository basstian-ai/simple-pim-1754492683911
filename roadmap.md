# Roadmap

## Progress
- Improved `lib/slugify.js`:
  - Replaced the placeholder implementation with a robust slugifier that removes diacritics via Unicode normalization.
  - Trimmed leading and trailing hyphens, added optional max-length support, and exported multiple shapes for CommonJS/ES module interop.
  - Added a small `_impl` diagnostics object for debugging.

## Next Steps
- [ ] Design and implement an admin dashboard to manage products and categories.
- [ ] Create user interface components for creating, editing, and deleting products directly in the dashboard.
- [ ] Add intuitive navigation with a sidebar and breadcrumb trail to improve orientation.
- [ ] Implement role-based access control for admin functionality.
- [ ] Surface inventory metrics and recent activity in dashboard widgets.
