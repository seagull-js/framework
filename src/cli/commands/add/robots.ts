import { Command, command, metadata } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { ApiRobots } from '../../../scaffold'
import { log } from '../../lib/logger'

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'scaffold a robots.txt API handler' })
export default class extends Command {
  @metadata
  execute() {
    const gen = ApiRobots()
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'backend', 'api', `RobotsTxt.ts`)
    gen.toFile(dest)
    log(`created RobotsTxt.ts in: ${dest}`)
  }
}
