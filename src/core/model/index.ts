/** @module Core */
import * as AWS from 'aws-sdk'
import * as dashify from 'dashify'
import 'reflect-metadata'
import { generate as newID } from 'shortid'
// import * as DB from './ddb'
import { ReadOnlyConfig } from '../util'
import field from './field'

/**
 * Represents a Document in a NoSQL Document database (precisely: DynamoDB).
 * Currently it is not directly available in the browser, but must be accessed
 * from within API handlers exclusively.
 *
 * You can scale up your database tables by increasing the throughput attributes
 * as high as you want, but this can become costly if you're not conservative.
 * Nevertheless, it is possible to scale up as high as you want and you only pay
 * for throughput, not storage.
 *
 * The name of the database table is derived automatically from the class name,
 * properties and their types from typescript-types. The primary index field is
 * managed automatically for you, as well as default timestamp fields. The
 * @fields of your models are also typechecked at runtime for you when you try
 * to save objects into the database.
 */
export default class Model {
  /**
   * static attributes for table metadata and settings
   */

  // number of reads per second (records per 4KB)
  static readsPerSecond: number = 5

  // number of writes per second (records per 4kb)
  static writesPerSecond: number = 5

  /**
   * static methods for managing model objects ("CRUD")
   */

  // return a list of all objects in the database table
  static async all<T extends Model>(this: { new (): T }): Promise<T[]> {
    const instance = new this()
    const TableName = instance._name
    const client = instance.client()
    const { Items } = await client.scan({ TableName }).promise()
    return Items.map(item => Object.assign(new this(), item))
  }

  // remove ALL objects in the database table, returns number of removed items
  static async clear<T extends Model>(): Promise<number> {
    const all = await this.all()
    for (const item of all) {
      await item.remove()
    }
    return all.length
  }

  // directly create a new object from parameters, save it and then return it
  static async create<T extends Model>(this: { new (): T }, data): Promise<T> {
    const instance: T = Object.assign(new this(), data)
    return instance.save()
  }

  // Fetch an object from the database by id
  static async find<T extends Model>(
    this: { new (): T },
    id: string
  ): Promise<T> {
    const instance = new this()
    const TableName = instance._name
    const client = instance.client()
    const params = { Key: { id }, TableName }
    const { Item } = await client.get(params).promise()
    return Item ? Object.assign(new this(), Item) : undefined
  }

  // Remove an object from the database by id
  static async remove<T extends Model>(id: string): Promise<boolean> {
    const instance = await this.find(id)
    return instance ? !!instance.remove() : false
  }

  // shorthand for getting a DynamoDB DocumentClient instance
  private static client() {
    return new Model().client()
  }

  /**
   * private data fields that get auto-managed and persisted
   */

  // auto-managed field: when was this object created (unix timestamp)
  @field private createdAt: number = null

  // auto-managed field: primary key of the object (kind of uuid)
  @field private id: string = null

  // auto-managed field: when was this object updated last
  @field private updatedAt: number = null

  /**
   * convenient read-only accessors for the private data fields
   */

  // safe read-only accessor for the primary key field
  get _id(): string {
    return this.id
  }

  // safe read-only accessor for the createdAt timestamp as a Date object
  get _createdAt(): Date {
    return this.createdAt ? new Date(this.createdAt) : null
  }

  // safe read-only accessor for the updatedAt timestamp as a Date object
  get _updatedAt(): Date {
    return this.updatedAt ? new Date(this.updatedAt) : null
  }

  /**
   * convenience helpers for metadata, typechecking and error handling
   */

  // helper for getting the model name for a given object
  get _name(): string {
    return dashify(this.constructor.name)
  }

  // advanced magic stuff to get the data fields of the object and its types (!)
  get _interface(): { [field: string]: string } {
    const result = {}
    for (const key of Object.keys(this)) {
      const type = Reflect.getMetadata('design:type', this, key)
      if (type && type.name) {
        result[key] = type.name.toLowerCase()
      }
    }
    return result
  }

  // field names of derived models
  get _ownFields(): string[] {
    const whitelist = new Model()
    return Object.keys(this._interface).filter(key => !(key in whitelist))
  }

  // check if fields have wrong data types and return a list of wrong ones
  get _errors(): string[] {
    const itf = this._interface
    return this._ownFields
      .map(key => (typeof this[key] !== itf[key] ? key : false))
      .filter(key => key) as string[]
  }

  // shorthand helper for existing type errors on runtime
  get _isValid(): boolean {
    return this._errors.length <= 0
  }

  /**
   * public instance methods for model objects
   */

  // remove the object from the database
  async remove(): Promise<void> {
    const TableName = this._name
    const Key = { id: this._id }
    const client = this.client()
    client.delete({ Key, TableName }).promise()
  }

  // persist an object to the database, creating a new record or update existing
  async save(): Promise<this> {
    if (!this._isValid) {
      const fields = this._errors.join(', ')
      throw new Error(`invalid fields for ${this._name}: ${fields}`)
    }
    if (!this.id) {
      this.id = newID()
    }
    if (!this.createdAt) {
      this.createdAt = new Date().getTime()
    }
    this.updatedAt = new Date().getTime()
    const client = this.client()
    await client.put({ Item: this, TableName: this._name }).promise()
    return this
  }

  private client() {
    const region = ReadOnlyConfig.config.region
    const convertEmptyValues = true
    const params = { convertEmptyValues, region }
    return new AWS.DynamoDB.DocumentClient(params)
  }
}
