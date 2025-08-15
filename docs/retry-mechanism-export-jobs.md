# Retry Mechanism for Export Jobs

## Overview
This document outlines the retry mechanism implemented for export jobs in the PIM platform.

## Configuration Options
- **maxRetries**: The maximum number of retry attempts for a failed export job.
- **retryDelay**: The delay between retry attempts in milliseconds.

## Expected Behavior
When an export job fails, the system will automatically retry the job according to the configured options. If the job fails after the maximum number of retries, it will be marked as failed and logged for further investigation.