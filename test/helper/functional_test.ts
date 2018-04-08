import * as fs from 'fs'
import * as mockFS from 'mock-fs'
import BaseTest from './base_test'

export default class FunctionalTest extends BaseTest {
  mockCredentials = (name: string) => {
    process.env.HOME = '~'
    delete process.env.AWS_PROFILE
    this.mockFolder('~/.aws')
    const lines = [
      `[${name}]`,
      'aws_access_key_id = AKID',
      'aws_secret_access_key = YOUR_SECRET_KEY',
    ]
    fs.writeFileSync('~/.aws/credentials', lines.join('\n'))
  }

  /**
   * mock a directory with a given package.json file
   */
  mockPackageFile = (path, txt) => mockFS({ [path]: { 'package.json': txt } })

  /**
   * set environment variables to lambda execution environment
   */
  mockLambdaEnv = () => {
    process.env.LAMBDA_TASK_ROOT = true
    process.env.AWS_EXECUTION_ENV = true
  }

  /**
   * clear environment variables from lambda mocks
   */
  restoreLambdaEnv = () => {
    delete process.env.LAMBDA_TASK_ROOT
    delete process.env.AWS_EXECUTION_ENV
  }
}
