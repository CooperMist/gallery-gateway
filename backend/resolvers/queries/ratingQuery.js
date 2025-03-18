import Rating from '../../models/rating'
import Portfolio from '../../models/portfolio'

import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE } from '../../constants'

export function ratings (_, args, context) {
  const isRequestingOwnJudgeUser = context.username !== undefined &&
    context.authType === JUDGE && context.username === args.judgeUsername
  if (context.authType !== ADMIN && !isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  //return all ratings for a given portfolio
    return Rating.findAll({
    where: { portfolioId: args.portfolioId }
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

