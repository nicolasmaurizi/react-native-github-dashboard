import { useQuery } from "@tanstack/react-query";
import { githubConfig } from "../config/githubConfig";

export interface GithubIssue {
	id: number;
	number: number;
	title: string;
	state: "open" | "closed";
	user: {
		login: string;
		avatar_url: string;
	};
	comments: number;
	html_url: string;
}

const fetchRepoIssues = async (
	owner: string,
	repo: string
): Promise<GithubIssue[]> => {
	const { baseUrl, token } = githubConfig;

	const url = `${baseUrl}/repos/${owner}/${repo}/issues?state=open&per_page=50`;

	const res = await fetch(url, {
		headers: token ? { Authorization: `Bearer ${token}` } : undefined,
	});

	const text = await res.text();

	if (!res.ok) {
		throw new Error(`GitHub issues error: ${res.status} - ${text}`);
	}

	return JSON.parse(text);
};

export const useGithubRepoIssues = (owner: string, repo: string) =>
	useQuery<GithubIssue[], Error>({
		queryKey: ["githubRepoIssues", owner, repo],
		queryFn: () => fetchRepoIssues(owner, repo),
		enabled: !!owner && !!repo,
	});
