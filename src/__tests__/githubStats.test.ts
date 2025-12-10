import { computeGithubStats } from "../utils/githubStats";

describe("computeGithubStats", () => {
  it("calcula stats correctamente con repos válidos", () => {
    const repos = [
      { stargazers_count: 10, language: "TypeScript" },
      { stargazers_count: 5, language: "TypeScript" },
      { stargazers_count: 3, language: "JavaScript" },
      { stargazers_count: 0, language: null },
    ] as any;

    const result = computeGithubStats(repos);

    expect(result.totalRepos).toBe(4);
    expect(result.totalStars).toBe(18);
    expect(result.topLanguage).toBe("TypeScript");
    expect(result.languagesChartData).toEqual([
      ["TypeScript", 2],
      ["JavaScript", 1],
    ]);
  });

  it("maneja lista vacía devolviendo valores por defecto", () => {
    const result = computeGithubStats([]);

    expect(result.totalRepos).toBe(0);
    expect(result.totalStars).toBe(0);
    expect(result.topLanguage).toBe("Unknown");
    expect(result.languagesChartData).toEqual([]);
  });
});
