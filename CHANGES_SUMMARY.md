- Fixed/updated:
  - pages/api/attributes/index.js
    - Converted to ESM export default
    - Added simple in-memory caching that re-reads the file when its mtime changes
    - Preserved previous API behavior (GET returns sample data, POST/PUT echo back)

- Roadmap item implemented:
  - "Add in-memory caching to attributes API" (small, low-risk performance improvement)
