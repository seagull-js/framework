import { ApiFrontend } from '@scaffold'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'

@suite('Unit::Scaffold::ApiFrontend')
class CodegenApiFrontendTest {
  @test
  'can generate SSR API'() {
    const gen = ApiFrontend()
    const code = gen.toString()
    expect(code).to.contain('export default class Frontend extends API {')
    expect(code).to.contain('async handle(request: Request): Promise<Response>')
  }

  @test
  'contains correct imports'() {
    const gen = ApiFrontend()
    const code = gen.toString()
    expect(code).to.contain(`import { API, Request, Response } from '@seagull`)
    expect(code).to.contain(`import { Routing, Document } from '@seagull`)
    expect(code).to.contain(`import { renderToString } from 'react-dom/server'`)
    expect(code).to.contain(`import { getStyles } from 'typestyle'`)
  }

  @test
  'contains correct path'() {
    const gen = ApiFrontend()
    const code = gen.toString()
    expect(code).to.contain(`static path: string = '/*'`)
  }

  @test
  'contains correct http method'() {
    const gen = ApiFrontend()
    const code = gen.toString()
    expect(code).to.contain(`static method: string = 'GET'`)
  }

  @test
  'has correct handler body'() {
    const gen = ApiFrontend()
    const code = gen.toString()
    expect(code).to.contain(`return this.html(`)
    expect(code).to.contain(`renderToString(`)
  }
}
