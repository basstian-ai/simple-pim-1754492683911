test('should retry export job on failure', async () => {
  const job = { /* job details */ };
  jest.spyOn(exportJobs, 'exportJob').mockImplementationOnce(() => { throw new Error('Failed'); });
  await expect(exportWithRetry(job)).rejects.toThrow('Export job failed after maximum retries');
  expect(exportJobs.exportJob).toHaveBeenCalledTimes(3);
});