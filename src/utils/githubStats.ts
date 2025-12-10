
export interface RepoLike {
  stargazers_count?: number | null;
  language?: string | null;
}

export interface GithubStats {
  totalRepos: number;
  totalStars: number;
  topLanguage: string;
  languagesChartData: [string, number][];
}

export function computeGithubStats(repos: RepoLike[] = []): GithubStats {
  const totalRepos = repos.length;

  const totalStars = repos.reduce(
    (sum, r) => sum + (r.stargazers_count ?? 0),
    0
  );

  const languageCount = repos.reduce<Record<string, number>>((acc, r) => {
    if (r.language) {
      acc[r.language] = (acc[r.language] ?? 0) + 1;
    }
    return acc;
  }, {});

  const topLanguage =
    Object.entries(languageCount).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Unknown";

  const languagesChartData = Object.entries(languageCount).sort(
    (a, b) => b[1] - a[1]
  );

  return { totalRepos, totalStars, topLanguage, languagesChartData };
}
