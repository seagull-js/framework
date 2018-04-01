/** @module Settings */

export class Config {
  /**
   * the AWS region for the application stack. Not all features are available
   * in all regions
   */
  region: string = 'eu-west-1'

  /**
   * domain list, for enabling within cloudfront
   */
  domains?: string[]

  /**
   * list of files for favicon needs
   */
  faviconFiles?: string[]

  /**
   * meta field for analytics data
   */
  analytics?: {
    /**
     * is analytics enabled at all?
     */
    enabled?: boolean

    /**
     * identifier string from google analytics for this website
     */
    ga?: string
  }

  /**
   * enable tracking!
   *
   * @param gaCode id for your google analytics property, like 'UA-XXXXXXXX'
   */
  enableAnalytics(gaCode: string): void {
    const opts = this.analytics || {}
    opts.enabled = true
    opts.ga = gaCode
    this.analytics = opts
  }

  /**
   * check if analytics is enabled
   */
  hasAnalytics(): boolean {
    return !!this.analytics && this.analytics.enabled
  }

  /**
   * add your domain(s) to the provided cloudfront instance
   *
   * @param domain your domain name for cloudfront integration
   */
  addDomain(domain: string): void {
    const list = this.domains || []
    list.push(domain)
    this.domains = list
  }
}
