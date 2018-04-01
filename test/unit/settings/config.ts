import { Config } from '@settings'
import 'chai/register-should'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import { join } from 'path'

@suite('Unit::Settings::Config')
class Test {
  @test
  'can be initialized'() {
    const cfg = new Config()
    cfg.should.be.an('object')
  }

  @test
  'can enable analytics'() {
    const cfg = new Config()
    cfg.enableAnalytics('UA-XXXXXX')
    cfg.analytics.should.be.an('object')
    cfg.analytics.enabled.should.be.equal(true)
    cfg.analytics.ga.should.be.equal('UA-XXXXXX')
  }

  @test
  'can test for analytics activation'() {
    const cfg = new Config()
    cfg.hasAnalytics().should.be.equal(false)
    cfg.enableAnalytics('UA-XXXXXX')
    cfg.hasAnalytics().should.be.equal(true)
  }

  @test
  'can add new domain if none exists yet'() {
    const cfg = new Config()
    cfg.addDomain('example.com')
    cfg.domains.should.be.an('array')
    cfg.domains.should.have.length(1)
    cfg.domains[0].should.be.equal('example.com')
  }

  @test
  'can add new domain if there are existing domains'() {
    const cfg = new Config()
    cfg.domains = ['a.com', 'b.com']
    cfg.addDomain('example.com')
    cfg.domains.should.be.an('array')
    cfg.domains.should.have.length(3)
    cfg.domains[2].should.be.equal('example.com')
  }

  @test
  'has default aws region'() {
    const cfg = new Config()
    cfg.region.should.be.equal('eu-west-1')
  }
}
