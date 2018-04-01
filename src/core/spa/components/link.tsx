/** @module Core */
import { merge } from 'lodash'
import * as React from 'react'
import { history } from '../../util'
import Page from '../page'

/**
 * Props for the Link component. Basically a target [[Page]] and some content
 * for the actual `<a></a>` tag, which can be a string or some component.
 */
export interface ILinkProps {
  /**
   *
   */
  children: JSX.Element
  onClick?: (event: any) => void
  page: any
  style?: object
}

export default class Link extends React.PureComponent<ILinkProps> {
  path = (): string => new (this.props.page as any)().path

  navigate = () => history.push(this.path())

  clickHandler = event => this.props.onClick(event) && this.navigate()

  render() {
    const style = merge({}, this.props.style)
    return (
      <a href={this.path()} onClick={this.clickHandler} style={style}>
        {this.props.children}
      </a>
    )
  }
}
