import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const JobDetails: React.FC = () => {
  const { jobId, runId } = useParams();
  const q = useQuery();
  const errorId = q.get('errorId');
  const back = q.get('back');

  return (
    <div>
      <h1>Job Details</h1>
      <div>Job ID: {jobId}</div>
      {runId && <div>Run ID: {runId}</div>}

      {errorId ? (
        <section aria-label="error-context">
          <h2>Selected Error</h2>
          <div>Pre-selected Error ID: {errorId}</div>
          {/* In a real UI you'd locate the error and scroll/select it */}
        </section>
      ) : (
        <div aria-label="error-context">No error selected</div>
      )}

      <div style={{ marginTop: 20 }}>
        {back ? (
          // back is expected to be a path like /feed?filters=... encoded already
          <Link to={back} data-testid="back-to-feed">Back to feed (preserve filters)</Link>
        ) : (
          <Link to="/feed">Back to feed</Link>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
