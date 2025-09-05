import { strict as assert } from 'node:assert';
import { safeTreeCommit } from '../src/lib/safeTreeCommit';

async function run() {
  await assert.rejects(
    safeTreeCommit({ token: 't', owner: '', repo: 'r', files: [] }),
    /owner.*repo.*provided/
  );
  await assert.rejects(
    safeTreeCommit({ token: 't', owner: 'o', repo: '', files: [] }),
    /owner.*repo.*provided/
  );
  console.log('safeTreeCommit parameter validation tests passed');
}

run();
