export const en = {
    installationsFound: (count: number) => `Found ${count} installations`,
    installationRepos: (id: number, count: number) => `Installation ${id} has access to ${count} repositories`,
    repoBranches: (name: string, count: number) => `Repository ${name} has ${count} branches`,
    branchCommits: (name: string, count: number) => `Branch ${name} has ${count} commits in the period`,
    repoCommits: (name: string, count: number) => `Repo ${name}: ${count} unique commits found`,
    searchingPRs: (query: string) => `Searching PRs with: ${query}`,
    foundPRs: (count: number, repo: string) => `Found ${count} PRs for ${repo}`,
    prCounted: (number: number, author: string, type: string) => `PR #${number} by ${author} counted as ${type}`,
    repoError: (fullName: string, message: string) => `Error processing repository ${fullName}: ${message}`,
    installationError: (id: number, message: string) => `Error processing installation ${id}: ${message}`,
    githubApiError: (message: string) => `Error accessing GitHub API: ${message}`,
    installationWarning: (account: string, error: string) => `⚠️ Installation ${account}: ${error}`,
    period: {
        week: "week",
        month: "month",
        days: (count: number) => `${count} days`
    },
    statsFor: (account: string, type: string, period: string) =>
        `📊 Statistics for ${account} (${type}) - Last ${period}:`,
    userStats: (name: string) => `\n👤 ${name}:`,
    userTotal: (commits: number, opened: number, closed: number) =>
        `  Total: ${commits} unique commits, ${opened} PRs opened, ${closed} PRs closed`,
    contributionsByRepo: `  Contributions by repository:`,
    repoStats: (name: string, commits: number, opened: number, closed: number) =>
        `    - ${name}: ${commits} commits, ${opened} PRs opened, ${closed} PRs closed`,
    noContributions: `  No contributions found for the period.`
};