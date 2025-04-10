import User from './user'
import Portfolio from './portfolio'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from '../constants'
import { ALLOWED_RATING_VALUES } from '../constants'

const PortfolioRating = sequelize.define('portfolioRating', {
  // id of portfolio submitted
  portfolioId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'portfolios',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  rating: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    allowNull: false
  },
    // The username of the judge for the Portfolio Period
    judgeUsername: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
        model: 'users',
        key: 'username'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
},
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
},
{
    validate: {
        ratingValueValidation () {
          if (!ALLOWED_RATING_VALUES.has(this.rating)) {
            throw new Error('Rating value must be an integer between 1 and 5 inclusive.')
          }
        }
      }
})

/**
 * Gets the ratings and portfolio IDs for a given portfolioPeriodId and judgeUsername as a Promise
 */
 PortfolioRating.getRatingsByPortfolioPeriodAndJudge = function getRatingsByPortfolioPeriodAndJudge (portfolioPeriodId, judgeUsername) {
  return PortfolioRating.findAll({
    attributes: ['portfolioId', 'value'],
    include: [{
      model: sequelize.models.portfolio,
      required: true,
      attributes: [],
      where: {
        portfolioPeriodId: portfolioPeriodId
      }
    }],
    where: {
      judgeUsername: judgeUsername
    }
  })
}


/**
 * Gets the judge for the rating as a Promise
 */
 PortfolioRating.prototype.getJudge = function getJudge () {
  if (!this.judgeUsername) {
    return Promise.resolve(null)
  }
  return User.findByPk(this.judgeUsername)
}

/**
 * Gets the portfolio for the rating as a Promise
 */
PortfolioRating.prototype.getPortfolio = function getPortfolio () {
  if (!this.portfolioId) {
    return Promise.resolve(null)
  }
  return Portfolio.findByPk(this.portfolioId)
}

export default PortfolioRating
