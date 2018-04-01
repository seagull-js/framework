import * as AWSMock from 'aws-sdk-mock'

export class SDB {
  static mock() {
    const sdb = new SDB()
    AWSMock.mock('SimpleDB', 'createDomain', sdb.createDomain)
    AWSMock.mock('SimpleDB', 'getAttributes', sdb.getAttributes)
    AWSMock.mock('SimpleDB', 'putAttributes', sdb.putAttributes)
    AWSMock.mock('SimpleDB', 'deleteAttributes', sdb.deleteAttributes)
    AWSMock.mock('SimpleDB', 'listDomains', sdb.listDomains)
    return sdb
  }

  static restore() {
    AWSMock.restore('SimpleDB')
  }

  db: { [key: string]: object } = {}
  domains: string[] = []

  createDomain = ({ DomainName }, cb) => {
    this.domains.push(DomainName)
    cb(null)
  }

  deleteAttributes = ({ ItemName }, cb) => {
    delete this.db[ItemName]
    cb(null)
  }

  getAttributes = ({ ItemName }, cb) => {
    cb(null, { Attributes: this.db[ItemName] })
  }

  listDomains = cb => {
    const DomainNames = this.domains
    cb(null, { DomainNames })
  }

  putAttributes = ({ ItemName, Attributes }, cb) => {
    this.db[ItemName] = Attributes
    cb(null, Attributes)
  }
}
