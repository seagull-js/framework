/** @module Scaffold */

import Ast, { VariableDeclarationKind, VariableStatement } from 'ts-simple-ast'
import { Base } from './'

export class FrontendIndex extends Base {
  private pagesDeclaration: VariableStatement

  constructor(pages: string[] = [], stores: string[] = []) {
    super()
    this.addExports('pages', pages)
    this.addExports('stores', stores)
  }

  private addExports(name: string, files: string[] = []) {
    const declarationKind = VariableDeclarationKind.Const
    const list = files.map(file => `require('${file}')`).join(',')
    const initializer = `[${list}]`
    const declarations = [{ name, initializer }]
    this.pagesDeclaration = this.sourceFile
      .addVariableStatement({ declarationKind, declarations })
      .setIsExported(true)
  }
}
