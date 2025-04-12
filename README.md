const readme = `
# ✨ GitHub Activity Report ✨

A TypeScript/JavaScript library to generate detailed GitHub activity reports across repositories and users for GitHub App installations.  

Uma biblioteca TypeScript/JavaScript para gerar relatórios detalhados de atividades no GitHub entre repositórios e usuários de instalações de GitHub Apps.  

---

## ✨ Features | Funcionalidades

- 📁 Generate reports for all repositories accessible by your GitHub App  
  Gere relatórios para todos os repositórios acessíveis pelo seu GitHub App

- 👤 Track commits, PRs opened, and PRs closed for each user  
  Acompanhe *commits*, *PRs* abertos e fechados por cada usuário

- 🧾 Collect contribution data (PRs and commits) from a specified date  
  Coleta dados de contribuições (PRs e commits) a partir de uma data especificada

- 📊 Get detailed statistics per repository and per user  
  Obtenha estatísticas detalhadas por repositório e por usuário

- 📝 View a formatted text summary or access the raw data  
  Veja um resumo formatado em texto ou acesse os dados brutos

- 🌍 Supports localization in English and Portuguese  
  Suporta idiomas em Inglês e Português
---

## 📦 Installation | Instalação

\`\`\`bash
npm install github-activity-report
\`\`\`

Or with pnpm | Ou com pnpm:

\`\`\`bash
pnpm add github-activity-report
\`\`\`

---

## 🚀 Usage | Uso

### Basic Usage | Uso Básico

\`\`\`ts
import { generateGitStats } from 'github-activity-report';

async function main() {
  const report = await generateGitStats({
    appId: 123456,  // Your GitHub App ID
    privateKey: "-----BEGIN RSA PRIVATE KEY-----\\n...",  // Your GitHub App private key
    daysToLookBack: 7,  // Optional, defaults to 7
    language: 'en'  // 'en' for English or 'pt' for Portuguese
  });

  // The formatted summary
  console.log(report.summary);

  // Access detailed data
  console.log(report.detailed_results);
}

main().catch(console.error);
\`\`\`

---

## ⚙️ Configuration Options | Opções de Configuração

The \`generateGitHubActivityReport\` function accepts these options:  
A função \`generateGitHubActivityReport\` aceita as seguintes opções:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| appId | number | Yes | Your GitHub App ID |
| privateKey | string | Yes | Your GitHub App's private key |
| webhookSecret | string | No | Your GitHub App's webhook secret |
| daysToLookBack | number | No | Number of days to look back for activity (default: 7) |
| language | 'en' \\| 'pt' | Yes | Language for the report ('en' for English, 'pt' for Portuguese) |

---

## 🧾 Report Structure | Estrutura do Relatório

The report object contains:  
O objeto do relatório contém:

- \`summary\`: A formatted text summary of GitHub activity  
  Um resumo formatado da atividade no GitHub

- \`detailed_results\`: Detailed data for each installation, including:  
  Dados detalhados para cada instalação, incluindo:
  - Repository statistics  
    Estatísticas por repositório
  - User statistics  
    Estatísticas por usuário
  - Commit counts  
    Contagem de *commits*
  - PRs opened and closed  
    *Pull requests* abertos e fechados

---

## 📄 License | Licença

MIT
`;
