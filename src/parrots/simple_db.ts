import * as AWSMock from 'aws-sdk-mock'

export class SimpleDB {
  static mock() {
    const sdb = new SimpleDB()
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
  db: { [domain: string]: { [key: string]: any } } = {}

  createDomain = ({ DomainName }, cb) => {
    this.db[DomainName] = {}
    cb(null)
  }

  deleteAttributes = ({ DomainName, ItemName }, cb) => {
    delete this.db[DomainName][ItemName]
    cb(null)
  }

  getAttributes = ({ DomainName, ItemName }, cb) => {
    cb(null, { Attributes: this.db[DomainName][ItemName] })
  }

  listDomains = cb => {
    const DomainNames = Object.keys(this.db)
    cb(null, { DomainNames })
  }

  putAttributes = ({ Attributes, DomainName, ItemName }, cb) => {
    this.db[DomainName][ItemName] = Attributes
    cb(null, Attributes)
  }
}
