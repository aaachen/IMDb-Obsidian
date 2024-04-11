import { App, PluginSettingTab, Setting } from 'obsidian'
import { FileSuggest, FolderSuggest } from './FileSuggest'
import IMDb from '../main'

export class Settings extends PluginSettingTab {
	plugin: IMDb
	counter: number

	constructor(app: App, plugin: IMDb) {
		super(app, plugin)
		this.plugin = plugin
	}

	display(): void {
		const { containerEl } = this

		containerEl.empty()
		containerEl.createEl('p', {
			text:
				'Sync your favorite movies, shows, or games into your obsidian vault from IMDb. ' +
				'The lists you export must be public for this plugin to download and parse',
		})

		new Setting(containerEl)
			.setName('omdb Api key')
			.setDesc(
				createFragment((fragment) => {
					fragment.append(
						'OMDb is queried to fetch additional information such as Posters, Writers, etc.' +
							' You can create an API key at ',
						fragment.createEl('a', {
							text: 'https://www.omdbapi.com/',
							href: 'https://www.omdbapi.com/',
						}),
						fragment.createEl('br'),
						'This can be omitted if you only need the information found in IMDb export CSVs',
					)
				}),
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.omdbApiKey)
					.onChange(async (value) => {
						this.plugin.settings.omdbApiKey = value
						await this.plugin.saveSettings()
					}),
			)

		// Lists
		new Setting(containerEl).setName('Lists').setHeading()

		// set the title of the imdb items
		new Setting(containerEl)
			.setName('File name')
			.setDesc('For the IMDb items to be imported')
			.setTooltip("You don't need to add '.md' to the filename")
			.addText((text) => {
				text.setPlaceholder('{{{title}}}')
				text.setValue(this.plugin.settings.fileName)
				text.onChange(async (value) => {
					this.plugin.settings.fileName = value
					await this.plugin.saveSettings()
				})
			})

		new Setting(containerEl)
			.setName('File template path')
			.setDesc('File template for creating the IMDb items')
			.addSearch((search) => {
				new FileSuggest(
					search.inputEl,
					async (value) => {
						this.plugin.settings.fileTemplatePath = value
						await this.plugin.saveSettings()
					},
					this.app,
				)
				search
					.setPlaceholder('')
					.setValue(this.plugin.settings.fileTemplatePath)
			})
		new Setting(containerEl)
			.setName('Overwrite')
			.setDesc(
				'Whether to overwrite existing notes. Modifications to notes will be lost, but changes from IMDb will now be picked up.',
			)
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.overwrite)

				toggle.onChange((newValue) => {
					this.plugin.settings.overwrite = newValue
					this.plugin.saveSettings()
				})
			})

		new Setting(containerEl)
			.setName('Export lists')
			.setDesc('Add IMDb list to export')
			.addButton((button) =>
				button
					.onClick(async () => {
						const currentExportSettings =
							this.plugin.settings.exportSettings
						this.plugin.settings.exportSettings =
							currentExportSettings.concat({
								listName: '',
								targetFolderPath: '',
								imdbListUrl: '',
							})
						await this.plugin.saveSettings()
						this.display()
					})
					.setButtonText('Add List'),
			)

		this.displayListContainers(containerEl)
	}

	displayListContainers(containerEl: HTMLElement): void {
		this.plugin.settings.exportSettings.forEach((setting, i) => {
			const listHeader = containerEl.createEl('div', { cls: 'callout' })
			new Setting(listHeader).setName('List').setHeading()
			const btn = listHeader.createEl('button', {
				cls: 'close-button',
				type: 'button',
			})
			btn.createEl('span', { text: 'x' })
			btn.addEventListener('click', async () => {
				this.plugin.settings.exportSettings.splice(i, 1)
				await this.plugin.saveSettings()
				this.display()
			})

			new Setting(containerEl)
				.setName('List name')
				.setDesc('Friendly name of your list')
				.addText((text) => {
					text.setPlaceholder('My Watch List')
						.setValue(setting.listName)
						.onChange(async (newName) => {
							this.plugin.settings.exportSettings[i].listName =
								newName
							await this.plugin.saveSettings()
						})
				})
			new Setting(containerEl)
				.setName('Target folder')
				.setDesc(
					'If you leave this empty, the items will be created in the root directory.',
				)
				.addSearch((search) => {
					new FolderSuggest(
						search.inputEl,
						async (value) => {
							setting.targetFolderPath = value
							await this.plugin.saveSettings()
						},
						this.app,
					)
					search.setPlaceholder('').setValue(setting.targetFolderPath)
				})
			new Setting(containerEl)
				.setName('IMDb list URL')
				.setDesc("List you'd like to export from")
				.addText((text) => {
					text.setPlaceholder('https://www.imdb.com/list/ls523701947')
						.setValue(setting.imdbListUrl)
						.onChange(async (newUrl) => {
							this.plugin.settings.exportSettings[i].imdbListUrl =
								newUrl
							await this.plugin.saveSettings()
						})
				})
		})
	}
}
