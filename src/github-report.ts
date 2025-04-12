import { App } from "octokit"
import {
  GitHubActivityReport,
  UserStatsMap
} from "./types"
import { Config } from "./config"
import { generateReport } from "./report"
import { getLocalization } from "./localization"

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
  const daysToLookBack = config.daysToLookBack || 7
  const t = getLocalization(config.language || "en")
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToLookBack)
  const since = cutoffDate.toISOString()
  const sinceDateStr = cutoffDate.toISOString().slice(0, 10)

  const app = new App({
    appId: config.appId,
    privateKey: config.privateKey,
    webhooks: config.webhookSecret ? { secret: config.webhookSecret } : undefined,
  })

  try {
    const installationsResponse = await app.octokit.request('GET /app/installations')
    const installations = installationsResponse.data
    console.log(t.installationsFound(installations.length))

    const installationPromises = installations.map(async (installation) => {
      try {
        const octokit = await app.getInstallationOctokit(installation.id)

        const { data: { repositories: repos } } = await octokit.request('GET /installation/repositories', {
          per_page: 100
        })

        console.log(t.installationRepos(installation.id, repos.length))

        const repoPromises = repos.map(async (repo) => {
          const userStats: UserStatsMap = {}

          try {
            const ownerLogin = repo.owner.login
            const repoName = repo.name
            const processedCommits = new Set<string>()

            const combinedQuery = `
              query($owner: String!, $repo: String!, $since: GitTimestamp!) {
                repository(owner: $owner, name: $repo) {
                  refs(refPrefix: "refs/heads/", first: 100) {
                    nodes {
                      name
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
              }
            `

            const combinedResult = await octokit.graphql(combinedQuery, {
              owner: ownerLogin,
              repo: repoName,
              since: since
            })

            const branches = (combinedResult as any).repository.refs.nodes || []
            console.log(t.repoBranches(repoName, branches.length))

            for (const branch of branches) {
              const branchCommits = branch.target?.history?.nodes || []

              for (const commit of branchCommits) {
                if (!processedCommits.has(commit.oid)) {
                  processedCommits.add(commit.oid)
                  const authorLogin = commit.author.user?.login ||
                    commit.author.name ||
                    commit.author.email ||
                    "Unknown"

                  if (!userStats[authorLogin]) {
                    userStats[authorLogin] = {
                      commitsByRepo: { [repoName]: 1 },
                      pullRequestsByRepo: {},
                      totalCommits: 1,
                      totalPRsOpened: 0,
                      totalPRsClosed: 0
                    }
                  } else {
                    userStats[authorLogin].totalCommits++
                    userStats[authorLogin].commitsByRepo[repoName] =
                      (userStats[authorLogin].commitsByRepo[repoName] || 0) + 1
                  }
                }
              }
            }

            const prQuery = `
              query($searchQuery: String!) {
                search(query: $searchQuery, type: ISSUE_ADVANCED, first: 100) {
                  edges {
                    node {
                      ... on PullRequest {
                        number
                        author {
                          login
                        }
                        createdAt
                        closedAt
                      }
                    }
                  }
                }
              }
            `

            const prSearchQuery = `repo:${ownerLogin}/${repoName} is:pr updated:>=${sinceDateStr}`
            const prResult = await octokit.graphql(prQuery, { searchQuery: prSearchQuery })
            const pullRequests = (prResult as any).search.edges.map((edge: any) => edge.node)

            for (const pr of pullRequests) {
              if (pr?.author) {
                const authorLogin = pr.author.login || "Unknown"

                if (!userStats[authorLogin]) {
                  userStats[authorLogin] = {
                    commitsByRepo: {},
                    pullRequestsByRepo: {},
                    totalCommits: 0,
                    totalPRsOpened: 0,
                    totalPRsClosed: 0
                  }
                }

                if (!userStats[authorLogin].pullRequestsByRepo[repoName]) {
                  userStats[authorLogin].pullRequestsByRepo[repoName] = {
                    opened: 0,
                    closed: 0
                  }
                }

                const createdAt = new Date(pr.createdAt)
                if (createdAt >= cutoffDate) {
                  userStats[authorLogin].pullRequestsByRepo[repoName].opened++
                  userStats[authorLogin].totalPRsOpened++
                }

                if (pr.closedAt) {
                  const closedAt = new Date(pr.closedAt)
                  if (closedAt >= cutoffDate) {
                    userStats[authorLogin].pullRequestsByRepo[repoName].closed++
                    userStats[authorLogin].totalPRsClosed++
                  }
                }
              }
            }

            return { repoName, success: true, userStats }
          } catch (repoError: any) {
            console.log(t.repoError(repo.full_name, repoError.message))
            return { repoName: repo.full_name, success: false, error: repoError.message, userStats }
          }
        })

        const repoResults = await Promise.all(repoPromises)

        const mergedUserStats: UserStatsMap = {}

        for (const result of repoResults) {
          if (result.success && result.userStats) {
            for (const [userName, stats] of Object.entries(result.userStats)) {
              if (!mergedUserStats[userName]) {
                mergedUserStats[userName] = {
                  commitsByRepo: { ...stats.commitsByRepo },
                  pullRequestsByRepo: { ...stats.pullRequestsByRepo },
                  totalCommits: stats.totalCommits,
                  totalPRsOpened: stats.totalPRsOpened,
                  totalPRsClosed: stats.totalPRsClosed
                }
              } else {
                mergedUserStats[userName].totalCommits += stats.totalCommits
                mergedUserStats[userName].totalPRsOpened += stats.totalPRsOpened
                mergedUserStats[userName].totalPRsClosed += stats.totalPRsClosed

                for (const [repoName, commitCount] of Object.entries(stats.commitsByRepo)) {
                  mergedUserStats[userName].commitsByRepo[repoName] =
                    (mergedUserStats[userName].commitsByRepo[repoName] || 0) + commitCount
                }

                for (const [repoName, prStats] of Object.entries(stats.pullRequestsByRepo)) {
                  if (!mergedUserStats[userName].pullRequestsByRepo[repoName]) {
                    mergedUserStats[userName].pullRequestsByRepo[repoName] = { ...prStats }
                  } else {
                    mergedUserStats[userName].pullRequestsByRepo[repoName].opened += prStats.opened
                    mergedUserStats[userName].pullRequestsByRepo[repoName].closed += prStats.closed
                  }
                }
              }
            }
          }
        }

        const installationStats = {
          id: installation.id,
          account: installation.account && 'login' in installation.account ? installation.account.login : "Unknown",
          account_type: installation.account && 'type' in installation.account ? installation.account.type : "Unknown",
          period_days: daysToLookBack,
          userStats: Object.entries(mergedUserStats).map(([userName, stats]) => {
            const repoSet = new Set([
              ...Object.keys(stats.commitsByRepo),
              ...Object.keys(stats.pullRequestsByRepo)
            ])

            return {
              name: userName,
              totalCommits: stats.totalCommits,
              totalPRsOpened: stats.totalPRsOpened,
              totalPRsClosed: stats.totalPRsClosed,
              repoContributions: Array.from(repoSet).map(repoName => ({
                repoName,
                commits: stats.commitsByRepo[repoName] || 0,
                prsOpened: (stats.pullRequestsByRepo[repoName]?.opened || 0),
                prsClosed: (stats.pullRequestsByRepo[repoName]?.closed || 0)
              }))
            }
          })
        }

        return installationStats
      } catch (error: any) {
        console.error(t.installationError(installation.id, error.message))
        return {
          id: installation.id,
          account: installation.account && 'login' in installation.account ? installation.account.login : "Unknown",
          error: error.message
        }
      }
    })

    const results = await Promise.all(installationPromises)
    const report = generateReport(results, t)

    return {
      summary: report,
      detailed_results: results
    }
  } catch (error: any) {
    console.error(t.githubApiError(error.message))
    throw error
  }
}