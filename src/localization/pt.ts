export const pt = {
    installationsFound: (count: number) => `Encontradas ${count} instalações`,
    installationRepos: (id: number, count: number) => `Instalação ${id} tem acesso a ${count} repositórios`,
    repoBranches: (name: string, count: number) => `Repositório ${name} tem ${count} branches`,
    branchCommits: (name: string, count: number) => `Branch ${name} tem ${count} commits no período`,
    repoCommits: (name: string, count: number) => `Repo ${name}: ${count} commits únicos encontrados`,
    searchingPRs: (query: string) => `Buscando PRs com: ${query}`,
    foundPRs: (count: number, repo: string) => `Encontrados ${count} PRs para ${repo}`,
    prCounted: (number: number, author: string, type: string) => `PR #${number} por ${author} contabilizado como ${type}`,
    repoError: (fullName: string, message: string) => `Erro ao processar repositório ${fullName}: ${message}`,
    installationError: (id: number, message: string) => `Erro ao processar instalação ${id}: ${message}`,
    githubApiError: (message: string) => `Erro ao acessar a API do GitHub: ${message}`,
    installationWarning: (account: string, error: string) => `⚠️ Instalação ${account}: ${error}`,
    period: {
        week: "semana",
        month: "mês",
        days: (count: number) => `${count} dias`
    },
    statsFor: (account: string, type: string, period: string) =>
        `📊 Estatísticas para ${account} (${type}) - Últimos ${period}:`,
    userStats: (name: string) => `\n👤 ${name}:`,
    userTotal: (commits: number, opened: number, closed: number) =>
        `  Total: ${commits} commits únicos, ${opened} PRs abertos, ${closed} PRs fechados`,
    contributionsByRepo: `  Contribuições por repositório:`,
    repoStats: (name: string, commits: number, opened: number, closed: number) =>
        `    - ${name}: ${commits} commits, ${opened} PRs abertos, ${closed} PRs fechados`,
    noContributions: `  Nenhuma contribuição encontrada no período.`
};