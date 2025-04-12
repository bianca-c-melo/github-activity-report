import { en } from "./localization/en";
import { pt } from "./localization/pt";

interface UserStats {
  name: string;
  totalCommits: number;
  totalPRsOpened: number;
  totalPRsClosed: number;
  repoContributions: {
    repoName: string;
    commits: number;
    prsOpened: number;
    prsClosed: number;
  }[];
}

interface RepoContributions { commits: number; prsOpened: number; prsClosed: number }

export function generateReport(results: any[], language: "en" | "pt" = "pt") {
  const t = language === "pt" ? pt : en;
  const lines: string[] = [];

  for (const installation of results) {
    if (installation.error) {
      lines.push(t.errorInstall(installation.account, installation.error));
      continue;
    }

    const periodLabel = installation.period_days === 7 ? (language === "pt" ? "semana" : "week") :
                        installation.period_days === 30 ? (language === "pt" ? "mês" : "month") :
                        `${installation.period_days} ${language === "pt" ? "dias" : "days"}`;

    lines.push(t.reportStart(installation.account, installation.account_type, periodLabel));

    if (installation.userStats?.length) {
    installation.userStats.sort((a: UserStats, b: UserStats) => {
      const ta = a.totalCommits + a.totalPRsOpened + a.totalPRsClosed;
      const tb = b.totalCommits + b.totalPRsOpened + b.totalPRsClosed;
      return tb - ta;
    });

      for (const user of installation.userStats) {
        lines.push(`\n${t.reportUser(user.name)}`);
        lines.push(t.reportUserStats(user.totalCommits, user.totalPRsOpened, user.totalPRsClosed));

        user.repoContributions.sort((a: RepoContributions, b: RepoContributions) => {
          const ta = a.commits + a.prsOpened + a.prsClosed;
          const tb = b.commits + b.prsOpened + b.prsClosed;
          return tb - ta;
        });

        for (const repo of user.repoContributions) {
          lines.push(t.reportRepoStats(repo.repoName, repo.commits, repo.prsOpened, repo.prsClosed));
        }
      }
    } else {
      lines.push(t.reportNone);
    }

    lines.push("");
  }

  return lines.join("\n");
}