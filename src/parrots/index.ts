/**
 * @module Parrots
 * @preferred
 *
 * # Parrot
 *
 * Strictly speaking, a [parrot](http://www.dictionary.com/browse/parrot) is a
 * bird that mimics speech and other things. In this case, parrots are mock
 * implementations for certain AWS services for local usage within tests or the
 * local development server. They are obviously not seagulls, but mimic
 * specific behavior, mostly from AWS Services.
 */

export * from './dynamo_db'
export * from './simple_db'
