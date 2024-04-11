import { MustacheContent } from './MustacheContent'
import { CsvHeader, IMDbCsvItem } from './model/imdbCsv'
import { OMDbJson } from './model/omdbJson'
import { IMDbList } from './IMDbList'
import { Notice } from 'obsidian'
import IMDb from '../main'

const trimQuote = (s: string) => {
	return s.replace(/^"|"$/g, '')
}

export class IMDbItem {
	id: string
	description: string
	title: string
	imdbUrl: string
	type: string
	imdbRating: number
	runtimeMin: number
	year: number
	genres: string[]
	votes: number
	releaseDate: string
	directors: string[]
	writers: string[]
	yourRating: number
	poster: string
	cast: string

	constructor(
		public plugin: IMDb,
		public imdbList: IMDbList,
		csvItem: IMDbCsvItem,
		omdbJson: OMDbJson | undefined,
	) {
		this.initFrom(csvItem, omdbJson)
	}

	// Merge OMDb and IMDb Csv data
	private initFrom(csvItem: IMDbCsvItem, omdbJson: OMDbJson | undefined) {
		this.description = omdbJson?.Plot ?? csvItem[CsvHeader.Description]
		this.title = omdbJson?.Title ?? csvItem[CsvHeader.Title]
		this.poster = omdbJson?.Poster ?? ''
		this.cast = omdbJson?.Actors ?? ''
		this.writers = omdbJson?.Writer.split(',').map((w) => w.trim())
		this.id = csvItem[CsvHeader.IMDbId]
		this.imdbUrl = csvItem[CsvHeader.IMDbURL]
		this.type = csvItem[CsvHeader.Type]
		this.imdbRating = parseInt(csvItem[CsvHeader.IMDbRating]) || undefined
		this.runtimeMin = parseInt(csvItem[CsvHeader.Runtime]) || undefined
		this.year = parseInt(csvItem[CsvHeader.Year]) || undefined
		this.genres = trimQuote(csvItem[CsvHeader.Genres])
			.split(',')
			.map((g) => g.trim())
		this.votes = parseInt(csvItem[CsvHeader.Votes]) || undefined
		this.releaseDate = csvItem[CsvHeader.Release]
		this.directors = trimQuote(csvItem[CsvHeader.Directors])
			.split(',')
			.map((g) => g.trim())
		this.yourRating = parseInt(csvItem[CsvHeader.YourRating]) || undefined
	}

	public getContent(template: string): string {
		return this.getMustacheContent(template)
	}

	private getMustacheContent(content: string): string {
		return new MustacheContent(content, this).getBody()
	}

	public async createFile(path: string): Promise<void> {
		const fileName = this.getMustacheContent(this.plugin.settings.fileName)
		const fullName = `${path}${fileName}.md`

		try {
			const fs = this.plugin.app.vault.adapter
			const fileAlreadyExists = await fs.exists(fullName)
			if (fileAlreadyExists && !this.plugin.settings.overwrite) {
				console.log('file already exists')
				return
			}

			const fileTemplate = this.plugin.settings.fileTemplatePath
			const template = await fs.read(fileTemplate)

			const content = this.getContent(template)
			if (content) {
				await fs.write(fullName, content)
			}
		} catch (error) {
			console.error(`Error writing ${fullName}`, error)
			new Notice(
				`⚠️ Error creating file for imdb item: ${this.title}. See developer console for detail`,
				5000,
			)
		}
	}
}
