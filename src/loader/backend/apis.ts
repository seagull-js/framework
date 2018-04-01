/** @module Loader */
import { AWS, Resource } from 'cloudformation-declarations'
import { fromPairs, times } from 'lodash'
import { Memoize } from 'typescript-memoize'
import Directory from '../abstract/directory'

/**
 * Serverless' special syntax for Events that trigger AWS Lambda Functions.
 * Currently only HTTP Events are supported.
 */
export interface ILambdaEvent {
  /**
   * Set this for an event of type HTTP
   */
  http?: {
    /**
     * The allowed HTTP verbs. Currently only `'GET'` and `'POST'`
     */
    method: 'GET' | 'POST'

    /**
     * The URL path for this Lambda. Example: `'/api/v1/todos'`
     */
    path: string
  }
}

/**
 * Serverless' special syntax for AWS Lambda functions.
 */
export interface ILambdaFunction {
  /**
   * Number of seconds before the lambda will get terminated. Functions with
   * HTTP events are routed through AWS API Gateway and are terminated after
   * a maximum of 30 seconds. Non-HTTP Lambdas are terminated after a maximum
   * of 5 minutes.
   */
  timeout?: number

  /**
   * Path to javascript file + exported member to invoke from AWS Lambda.
   * Example: `'dist/api/Frontend.handler'`
   */
  handler: string

  /**
   * Every Lambda can have multiple trigger events
   */
  events?: ILambdaEvent[]
}

/**
 * APIs are an abstraction for AWS Lambda functions.
 */
export default class Apis extends Directory {
  /**
   * Accessor for functions with special serverless lambda syntax.
   */
  @Memoize()
  get functions(): { [name: string]: ILambdaFunction } {
    const res: { [name: string]: ILambdaFunction } = {}
    const fns = times(this.filePaths.length, i => this.indexToLambda(i))
    return fromPairs(fns)
  }

  // transform name + module data into a lambda handler
  private indexToLambda(index: number): [string, ILambdaFunction] {
    const filePath = this.filePaths[index]
    const mod = this.modules[index].default
    const name = this.filePathToName(filePath)
    const handler = this.filePathToHandler(filePath)
    const events = this.moduleToEvents(mod)
    const timeout = 30
    const fn: ILambdaFunction = { handler, timeout, events }
    return [name, fn]
  }

  // Helper for transforming an API file path into a CloudFormation Lambda name
  private filePathToName(filePath: string): string {
    return this.shortFilePath(filePath).replace('/', '-')
  }

  // Helper for transforming an API file path into a CloudFormation Lambda handler
  private filePathToHandler(filePath: string): string {
    const fragment = this.shortFilePath(filePath)
    return `dist/backend/api/${fragment}.handler`
  }

  // helper function to get only the "relevant" part of a filePath
  private shortFilePath(filePath: string): string {
    const fragment = filePath.replace(/^.+api\//, '').replace(/\.js$/, '')
    return `api-${fragment}`
  }

  // transform data from API handler into events
  private moduleToEvents(mod: any): ILambdaEvent[] {
    const { method, path } = mod
    if (path && path.endsWith('*')) {
      const proxyPath = path.replace(/\/+\*$/, '')
      return [
        { http: { method, path: `${proxyPath}/` } },
        { http: { method, path: `${proxyPath}/{proxy+}` } },
      ]
    } else {
      return [{ http: { method, path } }]
    }
  }
}
