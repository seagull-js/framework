/** @module Loader */
import { AWS, Resource } from 'cloudformation-declarations'
import { Memoize } from 'typescript-memoize'
import Directory from '../abstract/directory'

/**
 * Models are an abstraction for AWS DynamoDB Tables.
 */
export default class Models extends Directory {
  /**
   * Accessor for a ready-built CloudFormation Resource Object which includes
   * all Models as AWS SimpleDB CloudFormation Templates.
   */
  @Memoize()
  get resources(): { [name: string]: Resource } {
    const res: { [name: string]: AWS.DynamoDB.Table } = {}
    this.modules.forEach(mod => (res[this.name(mod)] = this.table(mod)))
    return res
  }

  private name(mod: any): string {
    return new mod.default()._name
  }

  private table(mod: any): AWS.DynamoDB.Table {
    const Type = 'AWS::DynamoDB::Table'
    return { Type, Properties: this.props(mod) }
  }

  private props(mod: any): AWS.DynamoDB.Table.Properties {
    const AttributeDefinitions = [{ AttributeName: 'id', AttributeType: 'S' }]
    const KeySchema = [{ AttributeName: 'id', KeyType: 'HASH' }]
    const ReadCapacityUnits = mod.default.readsPerSecond.toString()
    const WriteCapacityUnits = mod.default.writesPerSecond.toString()
    const ProvisionedThroughput = { ReadCapacityUnits, WriteCapacityUnits }
    return { AttributeDefinitions, KeySchema, ProvisionedThroughput }
  }
}
