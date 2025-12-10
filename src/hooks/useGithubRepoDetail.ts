import { useQuery } from "@tanstack/react-query";
import { githubConfig } from "../config/githubConfig";

export interface GithubRepoDetail {
  id: number;
  name: string;
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  description: string | null;
  updated_at: string;
  html_url: string;
}

const fetchRepoDetail = async (
  owner: string,
  repoName: string
): Promise<GithubRepoDetail> => {
  const { baseUrl, token } = githubConfig;

  const res = await fetch(`${baseUrl}/repos/${owner}/${repoName}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub repo detail error: ${res.status} - ${text}`);
  }

  return res.json();
};

export const useGithubRepoDetail = (owner: string, repoName: string) =>
  useQuery<GithubRepoDetail, Error>({
    queryKey: ["githubRepoDetail", owner, repoName],
    queryFn: () => fetchRepoDetail(owner, repoName),
    enabled: !!owner && !!repoName,
  });
