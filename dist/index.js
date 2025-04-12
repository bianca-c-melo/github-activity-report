"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGitStats = generateGitStats;
const config_1 = require("./config");
const en_1 = require("./localization/en");
const pt_1 = require("./localization/pt");
async function generateGitStats(userConfig = {}) {
    const config = { ...config_1.defaultConfig, ...userConfig };
    const t = config.language === "en" ? en_1.en : pt_1.pt;
    return {
        summary: "...",
        detailed_results: []
    };
}
