import { useQuery } from '@tanstack/react-query';
import { githubConfig } from '../config/githubConfig';

export interface GithubUser {
  login: string;
  avatar_url: string;
  name?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
}

const fetchUser = async (username: string): Promise<GithubUser> => {
  const { baseUrl, token } = githubConfig;

  const res = await fetch(`${baseUrl}/users/${username}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub user error: ${res.status} - ${text}`);
  }

  return res.json();
};

export const useGithubUser = (username: string) =>
  useQuery<GithubUser, Error>({
    queryKey: ['githubUser', username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
  });
