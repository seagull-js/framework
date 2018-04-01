import { API, Request, Response } from '@core'

export default class Greet extends API {
  static method = 'GET'
  static path = '/greet'

  async handle(request: Request): Promise<Response> {
    const name = request.params.name || 'world'
    return this.text(`hello ${name}`)
  }
}

export const handler = () => {
  return Greet.dispatch.bind(Greet)
}
