import { Notice, Plugin } from 'obsidian'
import { IMDbList } from 'src/IMDbList'
import { Settings } from 'src/Settings'
import { DEFAULT_SETTINGS, IMDbSettings } from './src/model/settings'

export default class IMDb extends Plugin {
  settings: IMDbSettings
  scheduleInterval: null | number = null

  async onload() {
    await this.loadSettings()

    // This creates an icon in the left ribbon.
    this.addRibbonIcon('star', 'IMDb Sync', (evt: MouseEvent) => {
      this.updateLibrary()
    })

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: 'imdb-sync',
      name: 'IMDb Sync',
      callback: () => {
        this.updateLibrary()
      },
    })

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new Settings(this.app, this))
  }

  updateLibrary() {
	if (!this.settings.fileTemplatePath) {
      	new Notice(`⚠️ Please specify file template`, 5000)
		return;
	}
    this.settings.exportSettings.forEach(async exportSetting => {
      let { targetFolderPath, imdbListUrl, listName } = exportSetting
	  if (!imdbListUrl) {
      	new Notice(`⚠️ Please specify list url for list name: ${listName}`, 5000)
		return;
	  }
      const list = new IMDbList(this, imdbListUrl, targetFolderPath, listName)
      new Notice(`Beginning sync for ${listName}`, 5000)
      await list.createFolder()
      await list.fetchIMDbItems()
      await list.createIMDbItemsFiles()
    })
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
