export enum CsvHeader {
	IMDbId = 'Const',
	Description = 'Description',
	Title = 'Title',
	IMDbURL = 'URL',
	Type = 'Title Type',
	IMDbRating = 'IMDb Rating',
	Runtime = 'Runtime (mins)',
	Year = 'Year',
	Genres = 'Genres',
	Votes = 'Num Votes',
	Release = 'Release Date',
	Directors = 'Directors',
	YourRating = 'Your Rating',
}

export type IMDbCsvItem = {
	[header in CsvHeader]: string
}

export const DEFAULT_IMDB_CSV_ITEM: IMDbCsvItem = {
	[CsvHeader.IMDbId]: '',
	[CsvHeader.Description]: '',
	[CsvHeader.Title]: '',
	[CsvHeader.IMDbURL]: '',
	[CsvHeader.Type]: '',
	[CsvHeader.IMDbRating]: '',
	[CsvHeader.Runtime]: '',
	[CsvHeader.Year]: '',
	[CsvHeader.Genres]: '',
	[CsvHeader.Votes]: '',
	[CsvHeader.Release]: '',
	[CsvHeader.Directors]: '',
	[CsvHeader.YourRating]: '',
}
