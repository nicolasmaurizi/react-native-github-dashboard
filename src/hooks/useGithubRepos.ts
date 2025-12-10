import { useQuery } from '@tanstack/react-query';
import { githubConfig } from '../config/githubConfig';

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  stargazers_count: number;
  language: string | null;
  description: string | null;
  updated_at: string;
}

const fetchRepos = async (username: string): Promise<GithubRepo[]> => {
  const { baseUrl, token } = githubConfig;

  const res = await fetch(
    `${baseUrl}/users/${username}/repos?sort=updated&per_page=50`,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub repos error: ${res.status} - ${text}`);
  }

  return res.json();
};

export const useGithubRepos = (username: string) =>
  useQuery<GithubRepo[], Error>({
    queryKey: ['githubRepos', username],
    queryFn: () => fetchRepos(username),
    enabled: !!username,
  });
