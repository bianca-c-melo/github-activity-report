# GitHub Activity Report

A TypeScript/JavaScript library to generate detailed GitHub activity reports across repositories and users for GitHub App installations.

## Features

- Generate reports for all repositories accessible by your GitHub App
- Track commits, PRs opened, and PRs closed for each user
- Get detailed statistics per repository and per user
- View a formatted text summary or access the raw data
- Supports localization in English and Portuguese
- Use with Windmill for private key storage or provide your own

## Installation

```bash
npm install github-activity-report
```

Or with pnpm:

```bash
pnpm add github-activity-report
```

## Usage

### Basic Usage

```typescript
import { generateGitStats } from 'github-activity-report';

async function main() {
  const report = await generateGitStats({
    appId: 123456,  // Your GitHub App ID
    privateKey: "-----BEGIN RSA PRIVATE KEY-----\n...",  // Your GitHub App private key
    daysToLookBack: 7,  // Optional, defaults to 7
    language: 'en'  // 'en' for English or 'pt' for Portuguese
  });

  // The formatted summary
  console.log(report.summary);

  // Access detailed data
  console.log(report.detailed_results);
}

main().catch(console.error);
```

### Using with Windmill

If you're using Windmill for variable storage:

```typescript
import { generateGitHubActivityReport, getGitHubPrivateKey } from 'github-activity-report';

async function main() {
  // Get the GitHub private key from Windmill
  const privateKey = await getGitHubPrivateKey('u/username/github_private_key');

  const report = await generateGitHubActivityReport({
    appId: 123456,
    privateKey: privateKey,
    daysToLookBack: 30,
    language: 'pt'  // Using Portuguese for this report
  });

  console.log(report.summary);
}

main().catch(console.error);
```

## Configuration Options

The `generateGitHubActivityReport` function accepts these options:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| appId | number | Yes | Your GitHub App ID |
| privateKey | string | Yes | Your GitHub App's private key |
| webhookSecret | string | No | Your GitHub App's webhook secret |
| daysToLookBack | number | No | Number of days to look back for activity (default: 7) |
| language | 'en' \| 'pt' | Yes | Language for the report ('en' for English, 'pt' for Portuguese) |

## Report Structure

The report object contains:

- `summary`: A formatted text summary of GitHub activity
- `detailed_results`: Detailed data for each installation, including:
  - Repository statistics
  - User statistics
  - Commit counts
  - PRs opened and closed

## License

MIT
