export const en = {
    installationFound: (n: number) => `Found ${n} installations`,
    reposAccess: (id: number, n: number) => `Installation ${id} has access to ${n} repositories`,
    branchCount: (repo: string, n: number) => `Repository ${repo} has ${n} branches`,
    commitsCount: (branch: string, n: number) => `Branch ${branch} has ${n} commits in the period`,
    prSearch: (query: string) => `Searching PRs with: ${query}`,
    prFound: (repo: string, n: number) => `Found ${n} PRs for ${repo}`,
    prOpened: (n: number, author: string) => `PR #${n} by ${author} counted as opened`,
    prClosed: (n: number, author: string) => `PR #${n} by ${author} counted as closed`,
    reportStart: (acc: string, type: string, period: string) => `📊 Stats for ${acc} (${type}) - Last ${period}:`,
    reportUser: (name: string) => `👤 ${name}:`,
    reportUserStats: (c: number, o: number, f: number) => `  Total: ${c} unique commits, ${o} PRs opened, ${f} PRs closed`,
    reportRepoStats: (repo: string, c: number, o: number, f: number) => `    - ${repo}: ${c} commits, ${o} PRs opened, ${f} PRs closed`,
    reportNone: `  No contributions found in the period.`,
    errorInstall: (acc: string, msg: string) => `⚠️ Installation ${acc}: ${msg}`
  };