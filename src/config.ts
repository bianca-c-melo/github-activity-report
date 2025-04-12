export interface Config {
	daysToLookBack?: number
	language?: "en" | "pt"
	appId: number
	privateKey: string
	webhookSecret?: string
}