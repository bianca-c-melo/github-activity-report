import * as wmill from "windmill-client";
import { App } from "octokit";
import { 
  GitHubActivityReport,
  InstallationResult,
  UserStatsMap 
} from "./types";
import { Config } from "./config";
import { generateReport } from "./report";
import { getLocalization } from "./localization";

/**
 * Generate a GitHub activity report for all repositories
 * to which the GitHub App has access.
 * 
 * @param config Configuration options for the GitHub App
 * @returns The activity report data
 */
export async function generateGitStats(
  config: Config
): Promise<GitHubActivityReport> {
  const daysToLookBack = config.daysToLookBack || 7;
  const t = getLocalization(config.language || "en");
  
  const app = new App({
    appId: config.appId,
    privateKey: config.privateKey,
    webhooks: config.webhookSecret ? { secret: config.webhookSecret } : undefined,
  });

  try {
    const installationsResponse = await app.octokit.request('GET /app/installations');
    const installations = installationsResponse.data;
    console.log(t.installationsFound(installations.length));

    const results: InstallationResult[] = [];

    for (const installation of installations) {
      try {
        const octokit = await app.getInstallationOctokit(installation.id);
        
        const { data: { repositories: repos } } = await octokit.request('GET /installation/repositories', {
          per_page: 100
        });
        
        console.log(t.installationRepos(installation.id, repos.length));
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToLookBack);
        const since = cutoffDate.toISOString();
      
        const userStats: UserStatsMap = {};
      
        for (const repo of repos) {
          try {
            const processedCommits = new Set<string>();
            const ownerLogin = repo.owner.login;
            const repoName = repo.name;

            const branchesQuery = `
              query($owner: String!, $repo: String!) {
                repository(owner: $owner, name: $repo) {
                  refs(refPrefix: "refs/heads/", first: 100) {
                    nodes {
                      name
                      target {
                        oid
                      }
                    }
                  }
                }
              }
            `;
            
            const branchesResult = await octokit.graphql(branchesQuery, {
              owner: ownerLogin,
              repo: repoName
            });
            
            const branches = (branchesResult as { repository: { refs: { nodes: any[] } } }).repository.refs.nodes || [];
            console.log(t.repoBranches(repoName, branches.length));
            
            for (const branch of branches) {
              const commitsQuery = `
                query($owner: String!, $repo: String!, $branchName: String!, $since: GitTimestamp!) {
                  repository(owner: $owner, name: $repo) {
                    ref(qualifiedName: $branchName) {
                      target {
                        ... on Commit {
                          history(since: $since, first: 100) {
                            nodes {
                              oid
                              author {
                                user {
                                  login
                                }
                                name
                                email
                              }
                              committedDate
                            }
                          }
                        }
                      }
                    }
                  }
                }
              `;
              
              const commitsResult = await octokit.graphql(commitsQuery, {
                owner: ownerLogin,
                repo: repoName,
                branchName: `refs/heads/${branch.name}`,
                since: since
              });
              
              const branchCommits = (commitsResult as any).repository.ref?.target?.history?.nodes || [];
              console.log(t.branchCommits(branch.name, branchCommits.length));
              
              for (const commit of branchCommits) {
                if (!processedCommits.has(commit.oid)) {
                  processedCommits.add(commit.oid);
                  const authorLogin = commit.author.user?.login || 
                                     commit.author.name || 
                                     commit.author.email || 
                                     "Unknown";
                  if (!userStats[authorLogin]) {
                    userStats[authorLogin] = {
                      commitsByRepo: {},
                      pullRequestsByRepo: {},
                      totalCommits: 0,
                      totalPRsOpened: 0,
                      totalPRsClosed: 0
                    };
                  }
                  
                  if (!userStats[authorLogin].commitsByRepo[repoName]) {
                    userStats[authorLogin].commitsByRepo[repoName] = 0;
                  }
                  userStats[authorLogin].commitsByRepo[repoName]++;
                  userStats[authorLogin].totalCommits++;
                }
              }
            }
            
            console.log(t.repoCommits(repoName, processedCommits.size));
            
            const sinceDateStr = cutoffDate.toISOString().slice(0, 10); // YYYY-MM-DD
            const prQuery = `
              query($searchQuery: String!) {
                search(query: $searchQuery, type: ISSUE_ADVANCED, first: 100) {
                  issueCount
                  edges {
                    node {
                      ... on PullRequest {
                        number
                        author {
                          login
                        }
                        createdAt
                        closedAt
                        repository {
                          name
                          owner {
                            login
                          }
                        }
                      }
                    }
                  }
                }
              }
            `;
            
            const prSearchQuery = `repo:${ownerLogin}/${repoName} is:pr updated:>=${sinceDateStr}`;
            console.log(t.searchingPRs(prSearchQuery));
            
            const prResult = await octokit.graphql(prQuery, {
              searchQuery: prSearchQuery
            });
            
            const pullRequests = (prResult as any).search.edges.map((edge: any) => edge.node);
            console.log(t.foundPRs(pullRequests.length, repoName));
            
            for (const pr of pullRequests) {
              if (pr && pr.author) {
                const authorLogin = pr.author.login || "Unknown";
                
                if (!userStats[authorLogin]) {
                  userStats[authorLogin] = {
                    commitsByRepo: {},
                    pullRequestsByRepo: {},
                    totalCommits: 0,
                    totalPRsOpened: 0,
                    totalPRsClosed: 0
                  };
                }
                
                if (!userStats[authorLogin].pullRequestsByRepo[repoName]) {
                  userStats[authorLogin].pullRequestsByRepo[repoName] = {
                    opened: 0,
                    closed: 0
                  };
                }
                
                const createdAt = new Date(pr.createdAt);
                if (createdAt >= cutoffDate) {
                  userStats[authorLogin].pullRequestsByRepo[repoName].opened++;
                  userStats[authorLogin].totalPRsOpened++;
                  console.log(t.prCounted(pr.number, authorLogin, 'opened'));
                }
                
                if (pr.closedAt) {
                  const closedAt = new Date(pr.closedAt);
                  if (closedAt >= cutoffDate) {
                    userStats[authorLogin].pullRequestsByRepo[repoName].closed++;
                    userStats[authorLogin].totalPRsClosed++;
                    console.log(t.prCounted(pr.number, authorLogin, 'closed'));
                  }
                }
              }
            }
            
          } catch (repoError: any) {
            console.log(t.repoError(repo.full_name, repoError.message));
          }
        }
        
        const installationStats = {
          id: installation.id,
          account: installation.account.login,
          account_type: installation.account.type,
          period_days: daysToLookBack,
          userStats: []
        };
        
        for (const [userName, stats] of Object.entries(userStats)) {
          const userStat = {
            name: userName,
            totalCommits: stats.totalCommits,
            totalPRsOpened: stats.totalPRsOpened,
            totalPRsClosed: stats.totalPRsClosed,
            repoContributions: []
          };

          const repoSet = new Set([
            ...Object.keys(stats.commitsByRepo),
            ...Object.keys(stats.pullRequestsByRepo)
          ]);
          
          for (const repoName of repoSet) {
            const repoStat = {
              repoName: repoName,
              commits: stats.commitsByRepo[repoName] || 0,
              prsOpened: (stats.pullRequestsByRepo[repoName] && stats.pullRequestsByRepo[repoName].opened) || 0,
              prsClosed: (stats.pullRequestsByRepo[repoName] && stats.pullRequestsByRepo[repoName].closed) || 0
            };
            
            userStat.repoContributions.push(repoStat);
          }
          
          installationStats.userStats.push(userStat);
        }
        
        results.push(installationStats);
      } catch (error: any) {
        console.error(t.installationError(installation.id, error.message));
        results.push({
          id: installation.id,
          account: installation.account.login,
          error: error.message
        });
      }
    }
    
    const report = generateReport(results, t);
    
    return {
      summary: report,
      detailed_results: results
    };
  } catch (error: any) {
    console.error(t.githubApiError(error.message));
    throw error;
  }
}