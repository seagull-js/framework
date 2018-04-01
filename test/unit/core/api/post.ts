import { Request } from '@core'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import ExampleAPI from './example/Post'

@suite('Unit::Core::Api::Post')
class Test {
  @test
  async 'simple text response works'() {
    const api = new ExampleAPI()
    const payload = { name: 'Dude' }
    const request = new Request('POST', '/save', {}, payload)
    const response = await api.handle(request)
    expect(response.statusCode).to.be.equal(200)
    expect(response.body).to.be.equal('hello Dude')
  }
}
