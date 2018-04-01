import { API, Request, Response } from '@core'

export default class NotFound extends API {
  static method = 'GET'
  static path = '/missing'
  async handle(request: Request): Promise<Response> {
    return this.missing('nope!')
  }
}

export const handler = () => {
  return NotFound.dispatch.bind(NotFound)
}
