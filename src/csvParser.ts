import { requestUrl } from 'obsidian'
import { CsvHeader, DEFAULT_IMDB_CSV_ITEM, IMDbCsvItem } from './model/imdbCsv'

const getIMDbCsvItems = (csv: string): IMDbCsvItem[] => {
  let lines = csv
    .split('\n')
    .map(l => l.match(/(?:[^",]+|"[^"]*")+|^(?=,)|(?<=,)/g))
    .filter(l => l)
  let headers = lines.shift()
  let output = lines.map(l => {
    let obj: { [key: string]: string } = {}
    headers.map((h, i) => (obj[headers[i]] = l[i]))
    let item = Object.assign({}, DEFAULT_IMDB_CSV_ITEM, obj) as IMDbCsvItem
    if (!item) {
      throw Error(
        `Unable to map csv line item ${l} to headers ${Object.values(
          CsvHeader,
        )}`,
      )
    }
    return item
  })
  return output
}

export const retrieveIMDbCsvItems = async (
  exportListUrl: string,
): Promise<IMDbCsvItem[]> => {
  const res = await requestUrl({
    url: exportListUrl,
    headers: { 'Content-Type': 'text/csv' },
    method: 'GET',
  })
  return getIMDbCsvItems(res.text)
}
