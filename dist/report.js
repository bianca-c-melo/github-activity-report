"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
const en_1 = require("./localization/en");
const pt_1 = require("./localization/pt");
function generateReport(results, language = "pt") {
    const t = language === "pt" ? pt_1.pt : en_1.en;
    const lines = [];
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
            installation.userStats.sort((a, b) => {
                const ta = a.totalCommits + a.totalPRsOpened + a.totalPRsClosed;
                const tb = b.totalCommits + b.totalPRsOpened + b.totalPRsClosed;
                return tb - ta;
            });
            for (const user of installation.userStats) {
                lines.push(`\n${t.reportUser(user.name)}`);
                lines.push(t.reportUserStats(user.totalCommits, user.totalPRsOpened, user.totalPRsClosed));
                user.repoContributions.sort((a, b) => {
                    const ta = a.commits + a.prsOpened + a.prsClosed;
                    const tb = b.commits + b.prsOpened + b.prsClosed;
                    return tb - ta;
                });
                for (const repo of user.repoContributions) {
                    lines.push(t.reportRepoStats(repo.repoName, repo.commits, repo.prsOpened, repo.prsClosed));
                }
            }
        }
        else {
            lines.push(t.reportNone);
        }
        lines.push("");
    }
    return lines.join("\n");
}
