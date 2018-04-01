// import { AddApi } from '@cli'
// import 'chai/register-should'
// import { readFileSync } from 'fs'
// import { skip, slow, suite, test, timeout } from 'mocha-typescript'
// import Test from '../../../../helper/functional_test'

// const cwd = process.cwd()

// @suite('APIs')
// class FunctionalTest extends Test {
//   before() {
//     this.mockFolder('./tmp')
//     process.chdir('./tmp')
//   }

//   after() {
//     process.chdir(cwd)
//     this.restoreFolder()
//   }

//   @test
//   'can be instantiated'() {
//     const cmd = new AddApi()
//     cmd.should.be.an('object')
//     cmd.should.be.instanceOf(AddApi)
//   }

//   @test
//   async 'does generate the correct file'() {
//     const rootPath = './tmp'
//     new AddApi().execute('Demo', {})
//     const code = readFileSync('./tmp/backend/api/Demo.ts', 'utf-8')
//     code.should.contain('demo')
//   }
// }
