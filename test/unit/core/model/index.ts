import { Model } from '@core'
import { DynamoDB } from '@parrots'
import * as AWS from 'aws-sdk'
import { expect } from 'chai'
import { skip, slow, suite, test, timeout } from 'mocha-typescript'
import Todo from './example/todo'

@suite('Unit::Core::Model')
class Test {
  async before() {
    DynamoDB.mock()
    const ReadCapacityUnits = 1
    const WriteCapacityUnits = 1
    const ProvisionedThroughput = { ReadCapacityUnits, WriteCapacityUnits }
    const AttributeDefinitions = [{ AttributeName: 'id', AttributeType: 'S' }]
    const KeySchema = [{ AttributeName: 'id', KeyType: 'HASH' }]
    const TableName = 'todo'
    const params: AWS.DynamoDB.CreateTableInput = {
      AttributeDefinitions,
      KeySchema,
      ProvisionedThroughput,
      TableName,
    }
    await new AWS.DynamoDB().createTable(params).promise()
  }

  after() {
    DynamoDB.restore()
  }

  @test
  async 'models have inferrable names and are dasherized'() {
    // tslint:disable-next-line:max-classes-per-file
    const cm = new class CustomModel extends Model {}()
    expect(cm._name).to.be.equal('custom-model')
  }

  @test
  async 'models have inferrable attributes and types'() {
    const todo = new Todo()
    expect(todo._interface).to.contain({ id: 'string' })
    expect(todo._interface).to.contain({ done: 'boolean' })
    expect(todo._interface).to.contain({ text: 'string' })
  }

  @test
  async 'models generate IDs on save'() {
    const todo = new Todo()
    expect(todo._id).to.be.equal(null)
    await todo.save()
    expect(todo._id).to.be.a('string')
    expect(todo._id.length).to.be.above(0)
  }

  @test
  async 'models create and update timestamps on save'() {
    const todo = new Todo()
    expect(todo._createdAt).to.be.equal(null)
    expect(todo._updatedAt).to.be.equal(null)
    await todo.save()
    expect(todo._createdAt).to.be.not.equal(null)
    expect(todo._updatedAt).to.be.not.equal(null)
    expect(todo._createdAt.getTime()).to.be.equal(todo._updatedAt.getTime())
    await sleep(1)
    await todo.save()
    expect(todo._createdAt.getTime()).to.be.not.equal(todo._updatedAt.getTime())
  }

  @test
  async 'models do not override IDs on updating'() {
    const todo = new Todo()
    expect(todo._id).to.be.equal(null)
    const { _id } = await todo.save()
    expect(todo._id).to.be.a('string')
    expect(todo._id.length).to.be.above(0)
    await todo.save()
    expect(todo._id).to.be.equal(_id)
  }

  @test
  async 'models can check validity'() {
    const todo = new Todo()
    expect(todo._isValid).to.be.equal(true)
    expect(todo._errors).to.have.length(0)
    Object.assign(todo, { text: 17 })
    expect(todo._isValid).to.be.equal(false)
    expect(todo._errors).to.contain('text')
  }

  @test
  async 'find model by id works'() {
    const original = await Todo.create({ done: false, text: 'stuff' })
    expect(original).to.be.an('object')
    const todo = await Todo.find(original._id)
    expect(todo).to.be.an('object')
    expect(todo._id).to.be.equal(original._id)
  }

  @test
  async 'can delete models interactively'() {
    const instance = await Todo.create({ done: false, text: 'stuff' })
    const id = instance._id
    await instance.remove()
    const search = await Todo.find(id)
    expect(search).to.be.equal(undefined)
  }

  @test
  async 'can delete models statically'() {
    const instance = await Todo.create({ done: false, text: 'stuff' })
    const id = instance._id
    const status = await Todo.remove(id)
    expect(status).to.be.equal(true)
    const search = await Todo.find(id)
    expect(search).to.be.equal(undefined)
  }

  @test
  async 'can return all items'() {
    await Todo.create({ done: false, text: 'stuff1' })
    await Todo.create({ done: false, text: 'stuff2' })
    await Todo.create({ done: false, text: 'stuff3' })
    const list = await Todo.all()
    expect(list).to.be.an('array')
    expect(list[0]).to.be.an('object')
    expect(list[0]).to.be.instanceOf(Todo)
    expect(list.length).to.be.above(2)
  }

  @test
  async 'can remove all items'() {
    await Todo.create({ done: false, text: 'stuff1' })
    const originalList = await Todo.all()
    expect(originalList.length).to.be.above(0)
    await Todo.clear()
    const newList = await Todo.all()
    expect(newList.length).to.be.equal(0)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
