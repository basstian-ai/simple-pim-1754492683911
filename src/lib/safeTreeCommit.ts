export async function safeTreeCommit({
  token,
  owner,
  repo,
  branch = "main",
  files, // [{ path: "path/in/repo.txt", content: "..." }, ...]
  message = "Automated commit",
  encoding = "utf-8",
  force = false,
}: {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
  files: { path: string; content: string }[];
  message?: string;
  encoding?: "utf-8" | "base64";
  force?: boolean;
}) {
  if (!owner?.trim() || !repo?.trim()) {
    throw new Error("Both `owner` and `repo` must be provided separately.");
  }
  const { Octokit } = await import("octokit");
  const octokit = new Octokit({ auth: token });

  // 1) Resolve branch head → commit SHA
  const { data: ref } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const parentCommitSha = ref.object.sha;

  // 2) Get the commit → tree SHA and verify it exists
  let baseTreeSha: string | undefined;
  try {
    const { data: headCommit } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: parentCommitSha,
    });
    // The commit object only references a tree SHA. If that tree has been
    // garbage‑collected or otherwise doesn't exist, createTree would fail
    // with a 404. We defensively fetch the tree to ensure it exists before
    // using it as the base.
    const { data: headTree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: headCommit.tree.sha,
    });
    baseTreeSha = headTree.sha;
  } catch {
    // If we fail to resolve or fetch the base tree, omit it so we create a
    // tree from scratch. This still allows commits with only new files.
    baseTreeSha = undefined;
  }

  // 3) Create blobs for each file
  const blobs = await Promise.all(
    files.map(async (f) => {
      const { data } = await octokit.rest.git.createBlob({
        owner,
        repo,
        content: f.content,
        encoding,
      });
      return { path: f.path, sha: data.sha };
    })
  );

  // 4) Create the tree (with or without base_tree)
  const treeReq: any = {
    owner,
    repo,
    tree: blobs.map((b) => ({
      path: b.path,
      mode: "100644",
      type: "blob",
      sha: b.sha,
    })),
  };
  if (baseTreeSha) treeReq.base_tree = baseTreeSha;

  const { data: newTree } = await octokit.rest.git.createTree(treeReq);

  // 5) Create the commit
  const { data: newCommit } = await octokit.rest.git.createCommit({
    owner,
    repo,
    message,
    tree: newTree.sha,
    parents: [parentCommitSha],
  });

  // 6) Move the branch to the new commit
  await octokit.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommit.sha,
    force,
  });

  return newCommit.sha;
}

