import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import Entry from './entry'
import PortfolioRating from './portfolioRating'

// Defines a portfolio object and all of its fields
const Portfolio = sequelize.define('portfolio', {
  // Title of the portfolio
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    notEmpty: true
  },
  // The username of the student who owns the portfolio
  studentUsername: {
    allowNull: true,
    type: DataTypes.STRING,
    references: {
      model: 'users',
      key: 'username'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  // Leave it for reasons unbeknownst to anyone anymore
  name: {
    type:DataTypes.STRING,
    allowNull: true
  },
  // The portfolioPeriodId the portfolio is associated with
  portfolioPeriodId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'portfolioPeriods',
      key: 'id'
    },
    onDelete: 'no action',
    onUpdate: 'cascade'
  },
  score: {// added score to support scholarship judging functionality
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    allowNull: false
  }
})

Portfolio.prototype.getEntries = function getEntries () {
  return Entry.findAll({ where: { portfolioId: this.id } })
}

/*
* Calculate the score for a portfolio
*/
PortfolioRating.prototype.getScore = function getScore () {
  // Calculate score by getting all votes with this
  // entry id and then averaging over the sum of the votes
  return PortfolioRating.findAll({ where: { porfolioId: this.id } })
    .then((ratings) => {
      const ratingValues = ratings.map(rating => rating.value)
      if (ratingValues.length === 0) {
        return 0
      }
      return ratingValues.reduce((acc, curr) => acc + curr) / ratingValues.length
    })
}

export default Portfolio