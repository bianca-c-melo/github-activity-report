import { LocalizationStrings } from './localization';
import { InstallationResult } from './types';


/**
 * Generates a formatted text report from the GitHub activity data
 * 
 * @param results The installation results to format
 * @param t Localization strings to use for the report
 * @returns A formatted string report
 */
export function generateReport(results: InstallationResult[], t: LocalizationStrings): string {
  let reportLines = [];
  
  for (const installation of results) {
    if ('error' in installation) {
      reportLines.push(t.installationWarning(installation.account, installation.error));
      continue;
    }
    
    const periodLabel = installation.period_days === 7 ? t.period.week : 
                       (installation.period_days === 30 ? t.period.month : 
                       t.period.days(installation.period_days));
    
    reportLines.push(t.statsFor(
      installation.account, 
      installation.account_type, 
      periodLabel
    ));
    
    if (installation.userStats && installation.userStats.length > 0) {
      installation.userStats.sort((a, b) => {
        const totalA = a.totalCommits + a.totalPRsOpened + a.totalPRsClosed;
        const totalB = b.totalCommits + b.totalPRsOpened + b.totalPRsClosed;
        return totalB - totalA;
      });
      
      for (const user of installation.userStats) {
        reportLines.push(t.userStats(user.name));
        reportLines.push(t.userTotal(
          user.totalCommits, 
          user.totalPRsOpened, 
          user.totalPRsClosed
        ));
        
        user.repoContributions.sort((a, b) => {
          const totalA = a.commits + a.prsOpened + a.prsClosed;
          const totalB = b.commits + b.prsOpened + b.prsClosed;
          return totalB - totalA;
        });
        
        reportLines.push(t.contributionsByRepo);
        for (const repo of user.repoContributions) {
          reportLines.push(t.repoStats(
            repo.repoName, 
            repo.commits, 
            repo.prsOpened, 
            repo.prsClosed
          ));
        }
      }
    } else {
      reportLines.push(t.noContributions);
    }
    
    reportLines.push('');
  }
  
  return reportLines.join('\n');
}