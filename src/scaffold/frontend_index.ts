/** @module Scaffold */

import Ast, { VariableDeclarationType, VariableStatement } from 'ts-simple-ast'
import { Base } from './'

export class FrontendIndex extends Base {
  private pagesDeclaration: VariableStatement

  constructor(pages: string[] = []) {
    super()
    this.addPages(pages)
  }

  private addPages(files: string[] = []) {
    const list = files.map(file => `require('${file}')`).join(',')
    this.pagesDeclaration = this.sourceFile
      .addVariableStatement({
        declarationType: VariableDeclarationType.Const,
        declarations: [{ name: 'pages', initializer: `[${list}]` }],
      })
      .setIsExported(true)
  }
}
