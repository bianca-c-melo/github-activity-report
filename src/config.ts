export interface Config {
	daysToLookBack?: number
	language?: "en" | "pt"
}

export const defaultConfig: Config = {
	daysToLookBack: 7,
	language: "pt"
}