"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pt = void 0;
exports.pt = {
    installationFound: (n) => `Encontradas ${n} instalações`,
    reposAccess: (id, n) => `Instalação ${id} tem acesso a ${n} repositórios`,
    branchCount: (repo, n) => `Repositório ${repo} tem ${n} branches`,
    commitsCount: (branch, n) => `Branch ${branch} tem ${n} commits no período`,
    prSearch: (query) => `Buscando PRs com: ${query}`,
    prFound: (repo, n) => `Encontrados ${n} PRs para ${repo}`,
    prOpened: (n, author) => `PR #${n} por ${author} contabilizado como aberto`,
    prClosed: (n, author) => `PR #${n} por ${author} contabilizado como fechado`,
    reportStart: (acc, type, period) => `📊 Estatísticas para ${acc} (${type}) - Últimos ${period}:`,
    reportUser: (name) => `👤 ${name}:`,
    reportUserStats: (c, o, f) => `  Total: ${c} commits únicos, ${o} PRs abertos, ${f} PRs fechados`,
    reportRepoStats: (repo, c, o, f) => `    - ${repo}: ${c} commits, ${o} PRs abertos, ${f} PRs fechados`,
    reportNone: `  Nenhuma contribuição encontrada no período.`,
    errorInstall: (acc, msg) => `⚠️ Instalação ${acc}: ${msg}`
};
