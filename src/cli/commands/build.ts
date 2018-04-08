import { Command, command, Context, metadata, option, Options } from 'clime'
import { existsSync, writeFileSync } from 'fs'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'
import { Bundler, Compiler } from '../../compiler'
// import {
//   copyAssets,
//   createServerlessYaml,
//   initFolder,
//   lint,
//   prettier,
// } from '../lib/build/helper'

import { getAccountId } from '../lib/context'

export class BuildOptions extends Options {
  @option({
    default: true,
    description: 'do an optimized build',
    flag: 'o',
    name: 'optimize',
    placeholder: 'true | false',
    required: false,
  })
  optimize: boolean
}

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'compile a seagull app into a deployable bundle' })
export default class extends Command {
  @metadata
  async execute(options?: BuildOptions) {
    const optimize =
      options && process.env.NODE_ENV !== 'test' ? options.optimize : false
    // if (process.env.NODE_ENV !== 'test') {
    //   lint()
    //   prettier()
    // }
    // cleanBuildDirectory()
    // initFolder()
    const compiler = new Compiler(process.cwd())
    compiler.compile()
    compiler.finalize()
    // copyAssets()
    // await Bundler.bundle(optimize)
    const accountId = await getAccountId()
    // createServerlessYaml(accountId)
  }
}
