import * as mockFS from 'mock-fs'

/**
 * Implements common functionality that will be used across all tests.
 */
export default class BaseTest {
  /**
   * mock a folder path with MockFS. Require-ing files from mocked locactions
   * can't load from non-mocked locations (like node_modules), so require things
   * before you mock folders.
   */
  mockFolder = path => mockFS({ [path]: {} })

  /**
   * resets all mocking done by [[mockFolder]]. use after test is done.
   */
  restoreFolder = () => mockFS.restore()
}
