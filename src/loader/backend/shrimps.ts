/** @module Loader */
import { AWS, Resource } from 'cloudformation-declarations'
import { Memoize } from 'typescript-memoize'
import Directory from '../abstract/directory'

/**
 * Shrimps are an abstraction for AWS SimpleDB Tables.
 */
export default class Shrimps extends Directory {
  /**
   * Accessor for a ready-built CloudFormation Resource Object which includes
   * all Shrimps as AWS SimpleDB CloudFormation Templates.
   */
  @Memoize()
  get resources(): { [name: string]: Resource } {
    const names = this.modules.map(M => new M.default()._name)
    const res: { [name: string]: AWS.SDB.Domain } = {}
    const Type = 'AWS::SDB::Domain'
    const Properties = { Description: 'Seagull Shrimp' }
    names.forEach(name => (res[name] = { Type, Properties }))
    return res
  }
}
