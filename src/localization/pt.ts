export const pt = {
    installationFound: (n: number) => `Encontradas ${n} instalações`,
    reposAccess: (id: number, n: number) => `Instalação ${id} tem acesso a ${n} repositórios`,
    branchCount: (repo: string, n: number) => `Repositório ${repo} tem ${n} branches`,
    commitsCount: (branch: string, n: number) => `Branch ${branch} tem ${n} commits no período`,
    prSearch: (query: string) => `Buscando PRs com: ${query}`,
    prFound: (repo: string, n: number) => `Encontrados ${n} PRs para ${repo}`,
    prOpened: (n: number, author: string) => `PR #${n} por ${author} contabilizado como aberto`,
    prClosed: (n: number, author: string) => `PR #${n} por ${author} contabilizado como fechado`,
    reportStart: (acc: string, type: string, period: string) => `📊 Estatísticas para ${acc} (${type}) - Últimos ${period}:`,
    reportUser: (name: string) => `👤 ${name}:`,
    reportUserStats: (c: number, o: number, f: number) => `  Total: ${c} commits únicos, ${o} PRs abertos, ${f} PRs fechados`,
    reportRepoStats: (repo: string, c: number, o: number, f: number) => `    - ${repo}: ${c} commits, ${o} PRs abertos, ${f} PRs fechados`,
    reportNone: `  Nenhuma contribuição encontrada no período.`,
    errorInstall: (acc: string, msg: string) => `⚠️ Instalação ${acc}: ${msg}`
  };