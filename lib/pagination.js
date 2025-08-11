function paginate(items = [], page = 1, pageSize = 20) {
  const total = Array.isArray(items) ? items.length : 0;
  const safePageSize = Math.max(1, parseInt(pageSize, 10) || 20);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.max(1, Math.min(parseInt(page, 10) || 1, totalPages));

  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  const pageItems = Array.isArray(items) ? items.slice(start, end) : [];

  return {
    pageItems,
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages,
  };
}

module.exports = paginate;
