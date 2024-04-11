import { IMDbItem } from 'src/IMDbItem'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Mustache = require('mustache')

export class MustacheContent {
	constructor(
		public currentBody: string,
		public item: IMDbItem,
	) {}

	public getBody(): string {
		return Mustache.render(this.currentBody, this.item)
	}
}
