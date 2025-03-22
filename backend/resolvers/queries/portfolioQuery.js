import Portfolio from '../../models/portfolio'
import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'
import { isRequestingOwnUser } from './queryUtils'

export function portfolio (_, args, context) {
  return Portfolio.findByPk(args.id)
}

export function portfolios (_, args, context) {
  // Students can only look at their own portfolios
  if (args.studentUsername && context.authType !== ADMIN && !isRequestingOwnUser(context, args)) {
     throw new UserError('Permission Denied')
   }

  // Apply ordering, if desired
  const order = args.orderBy ? { order: [[args.orderBy.sort, args.orderBy.direction]] } : {}

  // If username given, show all portfolios the student has submitted to
  if (args.studentUsername) {
    // Get all the portfolios the student has been on
    // (including as group creator), through entries
    const whereClause = {
      where: {
        studentUsername: args.studentUsername
      }
    }
    return Portfolio.findAll(Object.assign({}, whereClause, order))
  }

  // Otherwise just show all portfolios (with possible ordering)
  return Portfolio.findAll(order)
}


export function periodPortfolios (_, args, context) {
  // Students can only look at their own portfolios
  if (context.authType !== ADMIN && context.authType !== JUDGE) {
     throw new UserError('Permission Denied')
   }

  return Portfolio.findAll({
      where: {
        portfolioPeriodId: args.portfolioPeriodId
      }
    })
}


