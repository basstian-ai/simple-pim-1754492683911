// Implement retry mechanism for export jobs
function exportWithRetry(job) {
  const maxRetries = 3;
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      // Call the existing export function
      exportJob(job);
      return;
    } catch (error) {
      attempts++;
      if (attempts === maxRetries) {
        throw new Error('Export job failed after maximum retries');
      }
    }
  }
}