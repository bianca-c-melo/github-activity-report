export interface RepoContribution {
    repoName: string;
    commits: number;
    prsOpened: number;
    prsClosed: number;
}

export interface UserStat {
    name: string;
    totalCommits: number;
    totalPRsOpened: number;
    totalPRsClosed: number;
    repoContributions: RepoContribution[];
}

export interface InstallationStats {
    id: number;
    account: string;
    account_type: string;
    period_days: number;
    userStats: UserStat[];
}

export interface InstallationError {
    id: number;
    account: string;
    error: string;
}

export type InstallationResult = InstallationStats | InstallationError;

export interface GitHubActivityReport {
    summary: string;
    detailed_results: InstallationResult[];
}

export interface UserStatsMap {
    [userName: string]: {
        commitsByRepo: { [repoName: string]: number };
        pullRequestsByRepo: {
            [repoName: string]: {
                opened: number;
                closed: number;
            }
        };
        totalCommits: number;
        totalPRsOpened: number;
        totalPRsClosed: number;
    };
}