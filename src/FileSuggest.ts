import { AbstractInputSuggest, App } from 'obsidian'
import { TAbstractFile, TFile, TFolder } from 'obsidian'

export class FileSuggest extends AbstractInputSuggest<string> {
	constructor(
		private inputEl: HTMLInputElement,
		private onSelectCb: (value: string) => void,
		app: App,
	) {
		super(app, inputEl)
	}

	getSuggestions(inputStr: string): string[] {
		const abstractFiles = this.app.vault.getAllLoadedFiles()
		const files: string[] = []
		const lowerCaseInputStr = inputStr.toLowerCase()

		abstractFiles.forEach((file: TAbstractFile) => {
			if (
				file instanceof TFile &&
				file.extension === 'md' &&
				file.path.toLowerCase().contains(lowerCaseInputStr)
			) {
				files.push(file.path)
			}
		})

		return files
	}

	renderSuggestion(filePath: string, el: HTMLElement): void {
		el.setText(filePath)
	}

	selectSuggestion(filePath: string, evt: MouseEvent | KeyboardEvent): void {
		this.onSelectCb(filePath)
		this.inputEl.value = filePath
		this.inputEl.blur()
		this.close()
	}
}

export class FolderSuggest extends AbstractInputSuggest<string> {
	constructor(
		private inputEl: HTMLInputElement,
		private onSelectCb: (value: string) => void,
		app: App,
	) {
		super(app, inputEl)
	}

	getSuggestions(inputStr: string): string[] {
		const abstractFiles = this.app.vault.getAllLoadedFiles()
		const folders: string[] = []
		const lowerCaseInputStr = inputStr.toLowerCase()

		abstractFiles.forEach((folder: TAbstractFile) => {
			if (
				folder instanceof TFolder &&
				folder.path.toLowerCase().contains(lowerCaseInputStr)
			) {
				folders.push(folder.path)
			}
		})

		return folders
	}

	renderSuggestion(folderPath: string, el: HTMLElement): void {
		el.setText(folderPath)
	}

	selectSuggestion(
		folderPath: string,
		evt: MouseEvent | KeyboardEvent,
	): void {
		this.onSelectCb(folderPath)
		this.inputEl.value = folderPath
		this.inputEl.blur()
		this.close()
	}
}
