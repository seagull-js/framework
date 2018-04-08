import { PackageJson } from '@settings'
import { expect } from 'chai'
import { writeFileSync } from 'fs'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import FunctionalTest from '../../helper/functional_test'

const cwd = process.cwd()

@suite('Functional::Settings::PackageJson')
class Test extends FunctionalTest {
  after() {
    this.restoreFolder()
    this.restoreLambdaEnv()
    process.chdir(cwd)
  }

  @test
  'can load within lambda execution context'() {
    this.mockLambdaEnv()
    const mock = { seagull: { domains: ['example.com'] } }
    this.mockPackageFile('/var/task/', JSON.stringify(mock))
    process.chdir('/var/task')
    const pkg = new PackageJson()
    pkg.config.should.be.an('object')
    pkg.config.domains.should.be.an('array')
    pkg.config.domains[0].should.be.equal('example.com')
  }

  @test
  'can load specific file'() {
    const mock = { seagull: { domains: ['example.com'] } }
    this.mockPackageFile('./tmp', JSON.stringify(mock))
    const pkg = new PackageJson('./tmp/package.json')
    pkg.config.should.be.an('object')
    pkg.config.domains.should.be.an('array')
    pkg.config.domains[0].should.be.equal('example.com')
  }

  @test
  'can enable analytics and save changes to file'() {
    const mock = { seagull: { domains: ['example.com'] } }
    this.mockPackageFile('./tmp', JSON.stringify(mock))
    new PackageJson('./tmp/package.json').enableAnalytics('UA-XXXXXX')
    const pkg = new PackageJson('./tmp/package.json')
    pkg.config.hasAnalytics().should.be.equal(true)
  }

  @test
  'can add domains and save changes to file'() {
    const mock = { seagull: { domains: ['example.com'] } }
    this.mockPackageFile('./tmp', JSON.stringify(mock))
    new PackageJson('./tmp/package.json').addDomain('example.com')
    const pkg = new PackageJson('./tmp/package.json')
    pkg.config.domains.should.be.an('array')
    pkg.config.domains[0].should.be.equal('example.com')
  }

  @test
  'has default aws region'() {
    const mock = { seagull: {} }
    this.mockPackageFile('./tmp', JSON.stringify(mock))
    const pkg = new PackageJson('./tmp/package.json')
    pkg.config.should.be.an('object')
    pkg.config.region.should.be.equal('eu-west-1')
  }

  @test
  'can load aws region'() {
    const mock = { seagull: { region: 'eu-central-1' } }
    this.mockPackageFile('./tmp', JSON.stringify(mock))
    const pkg = new PackageJson('./tmp/package.json')
    pkg.config.should.be.an('object')
    pkg.config.region.should.be.equal('eu-central-1')
  }

  @test
  'can load name'() {
    const mock = { name: 'myapp', seagull: {} }
    this.mockPackageFile('./tmp', JSON.stringify(mock))
    const pkg = new PackageJson('./tmp/package.json')
    pkg.config.should.be.an('object')
    pkg.name.should.be.equal('myapp')
  }
}
