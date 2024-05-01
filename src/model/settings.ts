export interface IMDbSettings {
	omdbApiKey: string
	exportSettings: ExportSetting[]
	fileName: string
	fileTemplatePath: string
	overwrite: boolean
	sanitizeFileName: boolean
}

export interface ExportSetting {
	listName: string
	targetFolderPath: string
	imdbListUrl: string
}

export const DEFAULT_SETTINGS: IMDbSettings = {
	omdbApiKey: '',
	exportSettings: [],
	fileName: '{{{title}}}',
	fileTemplatePath: '',
	overwrite: false,
	sanitizeFileName: false,
}
