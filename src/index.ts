import * as wmill from "windmill-client"
import { App } from "octokit"
import { Config, defaultConfig } from "./config"
import { generateReport } from "./report"
import { en } from "./localization/en"
import { pt } from "./localization/pt"

export async function generateGitStats(userConfig: Config = {}) {
  const config = { ...defaultConfig, ...userConfig };
  const t = config.language === "en" ? en : pt;
  return {
    summary: "...",
    detailed_results: []
  };
}