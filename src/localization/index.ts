import { en } from './en'
import { pt } from './pt'

export { en, pt }

export type LocalizationStrings = typeof en

export const getLocalization = (language: 'en' | 'pt'): LocalizationStrings => {
	return language === 'en' ? en : pt;
}