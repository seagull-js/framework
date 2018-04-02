import { translateCode } from '@compiler'
import { FrontendIndex } from '@scaffold'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'
import * as rfs from 'require-from-string'

@suite('Unit::Scaffold::Base')
class Test {
  @test
  'can be initialized'() {
    const gen = new FrontendIndex()
    expect(gen).to.be.an('object')
  }

  @test
  'has default structure'() {
    const gen = new FrontendIndex()
    const code = gen.toString()
    code.should.contain('export const pages = []')
  }

  @test
  'can have array of pages'() {
    const pages = ['index', 'hello', 'world']
    const stores = ['a', 'b', 'c']
    const gen = new FrontendIndex(pages, stores)
    const code = gen.toString()
    code.should.contain('export const pages = [')
    code.should.contain(`require('index')`)
    code.should.contain(`require('hello')`)
    code.should.contain(`require('world')`)
    code.should.contain('export const stores = [')
    code.should.contain(`require('a')`)
    code.should.contain(`require('b')`)
    code.should.contain(`require('c')`)
  }

  @test
  'can be required from JS'() {
    const gen = new FrontendIndex(['.'])
    const code = translateCode(gen.toString())
    const mod = rfs(code)
    mod.should.be.an('object')
    mod.pages.should.be.an('array')
  }
}
