import { UserError } from 'graphql-errors'
import PortfolioRating from '../../models/portfolioRating'
import {
  ADMIN, JUDGE
} from '../../constants'

export default {
  Portfolio: {
    entries (portfolio, _, context) {
      // Admins and judges should see all entries on a portfolio period
      // TO DO: Lock this down to Admin, judge, or user who owns the portfolio
      return portfolio.getEntries()
    },
    ratings (portfolio, _, context) {
      switch (context.authType) {
        case ADMIN:
          // Admins see all ratings
          return PortfolioRating.findAll({where: {portfolioId: portfolio.id}})
        case JUDGE:
          // Judges see only their own ratings
          return PortfolioRating.findAll({where: {portfolioId: portfolio.id, judgeUsername: context.username}})
        default:
          // Students cannot access this
          throw new UserError('Students cannot access portfolio ratings')
      }
    },
  }
}
