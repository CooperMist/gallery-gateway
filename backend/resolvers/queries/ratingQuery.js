import {Rating, PortfolioPeriod} from '../../models/rating'
import Portfolio from '../../models/portfolio'

import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'

export function ratings (_, args, context) {
  const isRequestingOwnJudgeUser = context.username !== undefined &&
    context.authType === JUDGE && context.username === args.judgeUsername
  if (context.authType !== ADMIN && !isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  //return all ratings for a given portfolio period
  return PortfolioPeriod.findOne({
    where: {
      id: args.portfolioPeriodId }
    }).then((portfolioPeriod) => {
      const portfolioIds = portfolioPeriod.portfolios.map(portfolio => portfolio.id)
      return getRatings(args.judgeUsername, context.authType, portfolioIds)
  })
}

export function rating (_, args, context) {
  const isRequestingOwnJudgeUser = context.username !== undefined &&
    context.authType === JUDGE && context.username === args.judgeUsername
  if (context.authType !== ADMIN && !isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  return Rating.findOne({
    where: {
      judgeUsername: args.judgeUsername,
      portfolioId: args.portfolioId
    }
  })
}

function getRatings (username, authType, portfolioIds) {
  // Give all ratings on the portfolio period if the user
  // is an admin and username was not given
  if (authType === ADMIN && !username) {
    return Rating.findAll({
      where: { portfolioId: portfolioIds }
    })
  } else {
    // Return the ratings only for the given judge
    return Rating.findAll({
      where: {
        judgeUsername: username,
        portfolioId: portfolioIds
      }
    })
  }
}