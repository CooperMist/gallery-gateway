import Portfolio from "../../models/portfolio"
import PortfolioRating from "../../models/portfolioRating"

export default {
    PortfolioPeriod: {
      judges (portfolioPeriod, _, context) {
        return portfolioPeriod.getJudges()
      },
      portfolios (portfolioPeriod, _, context) {
        return portfolioPeriod.getPortfolios()
      },
      ownRatings (portfolioPeriod, _, context) {
        return Portfolio.findAll({ where: { portfolioPeriodId: portfolioPeriod.id } }).then((periodPortfolios) => {
          // search for the portfolios that match the permission constraints
          const portfolioIds = periodPortfolios.map(portfolio => portfolio.id)
          return PortfolioRating.findAll({
            where: {
              judgeUsername: context.username,
              portfolioId: portfolioIds
            }
          })
        })
      }
    }
  }
  