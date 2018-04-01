import { field, Model } from '@core'

export default class Todo extends Model {
  @field done: boolean = false
  @field text: string = ''
}
