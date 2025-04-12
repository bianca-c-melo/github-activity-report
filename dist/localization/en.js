"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.en = void 0;
exports.en = {
    installationFound: (n) => `Found ${n} installations`,
    reposAccess: (id, n) => `Installation ${id} has access to ${n} repositories`,
    branchCount: (repo, n) => `Repository ${repo} has ${n} branches`,
    commitsCount: (branch, n) => `Branch ${branch} has ${n} commits in the period`,
    prSearch: (query) => `Searching PRs with: ${query}`,
    prFound: (repo, n) => `Found ${n} PRs for ${repo}`,
    prOpened: (n, author) => `PR #${n} by ${author} counted as opened`,
    prClosed: (n, author) => `PR #${n} by ${author} counted as closed`,
    reportStart: (acc, type, period) => `📊 Stats for ${acc} (${type}) - Last ${period}:`,
    reportUser: (name) => `👤 ${name}:`,
    reportUserStats: (c, o, f) => `  Total: ${c} unique commits, ${o} PRs opened, ${f} PRs closed`,
    reportRepoStats: (repo, c, o, f) => `    - ${repo}: ${c} commits, ${o} PRs opened, ${f} PRs closed`,
    reportNone: `  No contributions found in the period.`,
    errorInstall: (acc, msg) => `⚠️ Installation ${acc}: ${msg}`
};
