/** @module Loader */
import { join } from 'path'
import Folder from './abstract/folder'
import Backend from './backend/backend'
import Frontend from './frontend/frontend'
import Meta from './meta/index'

/**
 * This file represents the state of a seagull application, which files
 * exist in which folders, and so on. There are nested properties representing
 * specific features, mirroring the folder paths where seagull expects files
 * to be.
 */
export default class App extends Folder {
  /**
   * grouped features and components for the backend part (AWS). Must
   * be located at `${rootPath}/backend`
   */
  backend: Backend

  /**
   * grouped features and componentes for the frontend part (React). Must
   * be located at `${rootPath}/frontend`
   */
  frontend: Frontend

  /**
   * metadata for the app
   */
  meta: Meta

  /**
   * Create an instance of the seagull app located at the given path.
   *
   * @param rootPath path to the app folder
   */
  constructor(rootPath = process.cwd()) {
    super(rootPath || process.cwd())
    this.backend = new Backend(join(rootPath, 'backend'))
    this.frontend = new Frontend(join(rootPath, 'frontend'))
    this.meta = new Meta(rootPath)
  }
}
