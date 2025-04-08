import PortfolioRatings from '../../models/portfolioRating'
import Portfolio from '../../models/portfolio'

import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'

export function ratings (_, args, context) {
  const isRequestingOwnJudgeUser = context.username !== undefined &&
    context.authType === JUDGE && context.username === args.judgeUsername
  if (context.authType !== ADMIN && !isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  //return all of a judges ratings for a given portfolio period
  return Portfolio.findAll({
    where: {
      portfolioPeriodId: args.portfolioPeriodId }
    }).then((portfolios) => {
      const portfolioIds = portfolios.map(portfolio => portfolio.id)
      return getRatings(args.judgeUsername, context.authType, portfolioIds)
  })
}

export function rating (_, args, context) {
  const isRequestingOwnJudgeUser = context.username !== undefined &&
    context.authType === JUDGE && context.username === args.judgeUsername
  if (context.authType !== ADMIN && !isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  return PortfolioRatings.findOne({
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
    return PortfolioRatings.findAll({
      where: { portfolioId: portfolioIds }
    })
  } else {
    // Return the ratings only for the given judge
    return PortfolioRatings.findAll({
      where: {
        judgeUsername: username,
        portfolioId: portfolioIds
      }
    })
  }
}