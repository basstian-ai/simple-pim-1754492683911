import { Octokit } from "octokit";

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
  const octokit = new Octokit({ auth: token });

  // 1) Resolve branch head → commit SHA
  const { data: ref } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const parentCommitSha = ref.object.sha;

  // 2) Get the commit → tree SHA (this is the correct base_tree)
  let baseTreeSha: string | undefined;
  try {
    const { data: headCommit } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: parentCommitSha,
    });
    baseTreeSha = headCommit.tree.sha; // <-- IMPORTANT
  } catch {
    // If we fail to resolve the base tree, we’ll omit it
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

