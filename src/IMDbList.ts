import { retrieveIMDbCsvItems } from './csvParser'
import { IMDbItem } from './IMDbItem'
import IMDb from 'main'
import { Notice, requestUrl } from 'obsidian'
import { CsvHeader, IMDbCsvItem } from './model/imdbCsv'
import { OMDbJson } from './model/omdbJson'

const OMDB_API_URL = 'https://www.omdbapi.com/'
export class IMDbList {
	path: string
	exportListDownloadUrl: string
	items: IMDbItem[] = []

	constructor(
		public plugin: IMDb,
		listUrl: string,
		folderpath: string,
		public listName: string,
	) {
		this.path = `${folderpath}/`
		this.exportListDownloadUrl =
			listUrl.charAt(listUrl.length - 1) == '/'
				? `${listUrl}export`
				: `${listUrl}/export`
	}

	private appendIMDbItem(item: IMDbItem): void {
		this.items.push(item)
	}

	public getItems(): IMDbItem[] {
		return this.items
	}

	public async createFolder(): Promise<void> {
		try {
			await this.plugin.app.vault.createFolder(this.path)
		} catch (e) {
			if (e.message.includes('already exists')) return
			console.warn(e)
		}
	}

	public async fetchIMDbItems(): Promise<void> {
		try {
			const items = await retrieveIMDbCsvItems(this.exportListDownloadUrl)
			await Promise.all(
				items.map(async (_item: IMDbCsvItem) => {
					const omdbData = await this.getOmdbData(
						_item[CsvHeader.IMDbId],
					)
					const imdbItem = new IMDbItem(
						this.plugin,
						this,
						_item,
						omdbData,
					)
					this.appendIMDbItem(imdbItem)
				}),
			)
		} catch (e) {
			console.warn('Unable to fetch imdb csv. Error:', e)
			new Notice(
				'⚠️ Failed to fetch IMDb CSV. See Developer console for more detail',
			)
		}
	}

	public async createIMDbItemsFiles(): Promise<void> {
		await Promise.all([
			this.items.map((_item) => {
				return _item.createFile(this.path)
			}),
		])
		this.createNotice()
	}

	private createNotice() {
		const syncCount: number = this.items.length

		if (syncCount === 0) {
			return
		}

		const firstTitle = this.items[0].title
		let noticeMsg = ''

		noticeMsg = `🚀 ${this.listName} sync complete! ${this.items.length} items, including ${firstTitle}, are synced from IMDb!`

		new Notice(noticeMsg, 5000)
	}

	private async getOmdbData(id: string): Promise<OMDbJson | undefined> {
		try {
			const finalURL = new URL(OMDB_API_URL)
			finalURL.searchParams.append('i', id)
			finalURL.searchParams.append(
				'apikey',
				this.plugin.settings.omdbApiKey,
			)
			const res = await requestUrl({
				url: finalURL.toString(),
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			})
			const omdbJson = res.json as OMDbJson
			if (omdbJson.Response !== 'True') {
				console.warn(
					`omdb returned invalid response for id=[${id}]. Response:`,
					res,
				)
				return undefined
			}
			return omdbJson
		} catch (e) {
			console.warn(`Unable to get omdbData for imdbId=[${id}]`)
			return undefined
		}
	}
}
