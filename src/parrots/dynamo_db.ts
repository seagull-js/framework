/** @module Parrots */
import * as AWS from 'aws-sdk'
import * as AWSMock from 'aws-sdk-mock'

export class DynamoDB {
  static mock() {
    const ddb = new DynamoDB()
    AWSMock.mock('DynamoDB.DocumentClient', 'delete', ddb.delete)
    AWSMock.mock('DynamoDB.DocumentClient', 'get', ddb.get)
    AWSMock.mock('DynamoDB.DocumentClient', 'put', ddb.put)
    AWSMock.mock('DynamoDB.DocumentClient', 'query', ddb.query)
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', ddb.scan)
    AWSMock.mock('DynamoDB', 'createTable', ddb.createTable)
    return ddb
  }

  static restore() {
    AWSMock.restore('DynamoDB.DocumentClient')
    AWSMock.restore('DynamoDB')
  }

  db: { [tableName: string]: any[] } = {}

  createTable = ({ TableName }: AWS.DynamoDB.CreateTableInput, cb) => {
    this.db[TableName] = []
    cb(null)
  }

  delete = (
    { Key, TableName }: AWS.DynamoDB.DocumentClient.DeleteItemInput,
    cb
  ) => {
    const table = this.db[TableName]
    const key = Object.keys(Key)[0]
    const value = Key[key]
    const newTable = table.filter((item: any) => item._id !== value)
    this.db[TableName] = newTable
    const ConsumedCapacity = { CapacityUnits: 1, TableName }
    const result: AWS.DynamoDB.DocumentClient.DeleteItemOutput = {
      ConsumedCapacity,
    }
    cb(null, result)
  }

  get = ({ Key, TableName }: AWS.DynamoDB.DocumentClient.GetItemInput, cb) => {
    const table = this.db[TableName]
    const key = Object.keys(Key)[0]
    const value = Key[key]
    const Item = table.find(item => item[key] === value)
    const result: AWS.DynamoDB.DocumentClient.GetItemOutput = { Item }
    cb(null, result)
  }

  put = ({ Item, TableName }: AWS.DynamoDB.DocumentClient.PutItemInput, cb) => {
    const table = this.db[TableName]
    table.push(Item)
    const ConsumedCapacity = { CapacityUnits: 1, TableName }
    const result: AWS.DynamoDB.DocumentClient.GetItemOutput = {
      ConsumedCapacity,
    }
    cb(null, result)
  }

  query = (params: AWS.DynamoDB.DocumentClient.QueryInput, cb) => {
    const table = this.db[params.TableName]
    const keyName = Object.keys(params.ExpressionAttributeNames)[0]
    const key = params.ExpressionAttributeNames[keyName]
    const valueName = Object.keys(params.ExpressionAttributeValues)[0]
    const value = params.ExpressionAttributeValues[valueName]
    const Items = table.filter(item => item[key] === value)
    const result: AWS.DynamoDB.DocumentClient.QueryOutput = { Items }
    cb(null, result)
  }

  scan = ({ TableName }: AWS.DynamoDB.DocumentClient.ScanInput, cb) => {
    const Items = this.db[TableName]
    const result: AWS.DynamoDB.ScanOutput = { Items }
    cb(null, result)
  }
}
