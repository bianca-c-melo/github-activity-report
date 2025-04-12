# 📊 GitHub Stats Reporter

A modular library to fetch and generate GitHub contribution stats across installations and repositories, with multi-language support (🇺🇸 English & 🇧🇷 Portuguese).

Uma biblioteca modular para buscar e gerar estatísticas de contribuição no GitHub entre instalações e repositórios, com suporte a múltiplos idiomas (🇧🇷 Português e 🇺🇸 Inglês).

---

## 🚀 Installation | Instalação

\`\`\`bash
npm install git-stats-lib
\`\`\`

---

## 🛠️ Usage | Uso

\`\`\`ts
import { generateGitStats } from "git-stats-lib";

const main = async () => {
  const { summary } = await generateGitStats({
    language: "pt",           // "pt" ou "en"
    daysToLookBack: 30        // número de dias para analisar (default: 7)
  });

  console.log(summary);
};

main();
\`\`\`

---

## 🌐 Language Support | Suporte a Idiomas

| Language | Code | Output Example |
|---------|------|----------------|
| 🇺🇸 English | \`en\` | \`📊 Stats for my-org (Organization) - Last 7 days:\` |
| 🇧🇷 Português | \`pt\` | \`📊 Estatísticas para my-org (Organização) - Últimos 7 dias:\` |

You can customize the output language using the \`language\` config option.  
Você pode customizar o idioma da saída usando a opção \`language\`.

---

## ⚙️ Configuration Options | Opções de Configuração

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`language\` | \`"en"\` \\| \`"pt"\` | \`"pt"\` | Language of the output |
| \`daysToLookBack\` | \`number\` | \`7\` | Number of days to check contributions |

---

## 📁 Example Output | Exemplo de Saída

\`\`\`
📊 Estatísticas para my-org (Organização) - Últimos 7 dias:

👤 Bia:
  Total: 15 commits únicos, 3 PRs abertos, 2 PRs fechados
    - my-repo: 10 commits, 2 PRs abertos, 1 PR fechado
    - another-repo: 5 commits, 1 PR aberto, 1 PR fechado

👤 João:
  Nenhuma contribuição encontrada no período.
\`\`\`

---

## 📦 Output Structure | Estrutura da Saída

\`\`\`ts
type GitStatsResult = {
  summary: string; // Human-readable string (localized)
  detailed_results: InstallationResult[]; // Structured raw data
};
\`\`\`

---

## 📌 Coming Soon | Em breve

- [ ] CSV / JSON export
- [ ] GitHub Actions integration
- [ ] Web dashboard (React)

---

## 🤝 Contributing | Contribuindo

Contributions are welcome!  
Contribuições são bem-vindas!

Feel free to open issues, send pull requests, or suggest improvements.  
Sinta-se à vontade para abrir issues, enviar PRs ou sugerir melhorias.

---

## 📜 License | Licença

[MIT](./LICENSE)

---

Feito com 💙 por devs que amam dados de contribuição.  
Made with 💙 by devs who love contribution data.
