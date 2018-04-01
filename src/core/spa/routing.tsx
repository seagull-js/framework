/** @module Core */
// library imports
import { cloneDeep, get, keys, map, noop, reduce, without } from 'lodash'
import { inject, observer, Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { join } from 'path'
import * as React from 'react'
import {
  matchPath,
  Route,
  Router,
  RouterProps,
  StaticRouter,
  StaticRouterProps,
  Switch,
} from 'react-router'
import { matchRoutes } from 'react-router-config'
import { RouteProps } from 'react-router-dom'
import Request from '../api/request'
import { deepFreeze, history } from '../util'
import Page from './page'

// static routing or dynamic
declare type IRoutingConf =
  | {
      appRouter: typeof Router
      routerProps: RouterProps
    }
  | {
      appRouter: typeof StaticRouter
      routerProps: StaticRouterProps
    }

// loaded stores, minimial: routing
export type IStores = { routing: RouterStore } & {}
// should be: an array of classes which implements Page
// cant be expressed in typescript
type IPages<S, P> = Array<{ default: { new (): Page<S, P> } }>

export default class Routing {
  stores: IStores

  private routingConf: IRoutingConf
  private pages: IPages<any, any>
  private request

  constructor(isSSR = false, request?: Request) {
    this.stores = this.loadStores()
    this.pages = this.loadPages()
    // while ssr we use different routing classes
    this.routingConf =
      isSSR && request
        ? this.buildStaticRoutingConf(request)
        : this.buildBrowserRoutingConf()
  }

  initialMatchedPage() {
    let requestPath = (this.routingConf.routerProps as StaticRouterProps)
      .location as string
    if (typeof window !== 'undefined') {
      requestPath = window.location.pathname
    }
    const matched = matchRoutes(this.decoratedPages(), requestPath)
    if (matched.length) {
      const page: { new (props: any): Page<any, any> } = (matched[0] as any)
        .route.component.wrappedComponent
      return new page({
        history,
        location: deepFreeze(cloneDeep(history.location)),
        match: matched[0].match,
        ...this.stores,
      })
    }
    return null
  }

  load() {
    const pages = this.decoratedPages()
    return (
      <Provider {...this.stores}>
        <this.routingConf.appRouter {...this.routingConf.routerProps}>
          <Switch>{pages.map(page => React.createElement(Route, page))}</Switch>
        </this.routingConf.appRouter>
      </Provider>
    )
  }

  private decoratedPages() {
    const storeKeys: string[] = without(keys(this.stores), 'routing')

    return map(this.pages, (page): RouteProps => {
      const path: string = new page.default().path
      const component = inject(...storeKeys)(observer(page.default))
      const routeProp = {
        component,
        exact: true,
        key: path,
        path,
      }
      return routeProp
    })
  }

  private buildStaticRoutingConf(request: Request): IRoutingConf {
    return {
      appRouter: StaticRouter,
      routerProps: {
        context: {},
        location: request.path,
      },
    }
  }

  private buildBrowserRoutingConf(): IRoutingConf {
    const browserHistory = syncHistoryWithStore(history, this.stores.routing)
    return {
      appRouter: Router,
      routerProps: { history: browserHistory },
    }
  }

  private loadPages(): IPages<any, any> {
    return this.requireIndexByEnv().pages
  }

  private loadStores(): IStores {
    const rawStores: any[] = this.requireIndexByEnv().stores
    return reduce(
      keys(rawStores),
      (value, storeKey) => {
        value[storeKey] = new rawStores[storeKey].default()
        return value
      },
      {
        routing: new RouterStore(),
      }
    )
  }
  private requireIndexByEnv() {
    const isLambdaEnv = get(process, 'env.LAMBDA_TASK_ROOT')
    const isTestEnv = get(process, 'env.NODE_ENV') === 'test'
    if (!isLambdaEnv && !isTestEnv) {
      return require('../../../../../../.seagull/dist/frontend/index.js')
    }
    let cwd = process.cwd().toString()
    isTestEnv ? (cwd = join(cwd, '.seagull')) : noop()
    return require(join(cwd, 'dist', 'frontend', 'index.js'))
  }
}
