import React from 'react'
import PortfolioPeriodProgressTab from '../../components/portfolio/PortfolioPeriodProgressTab'

export default function ({ portfolioPeriod }) {
  // Extract all ratings we care about
  const allRatings = portfolioPeriod.portfolios.reduce(
    (lst, portfolio) => ([...lst, ...portfolio.ratings]),
    []
  )

  // Count the ratings by judge
  const ratingCountByJudge = allRatings.reduce(
    (accum, rating) => ({
      ...accum,
      [rating.judge.username]: (accum[rating.judge.username] || 0) + 1
    }),
    {}
  )

  // Count the number of total portfolios that are in judging
  const numPortfolios = portfolioPeriod.portfolios.length

  const portfolioPeriodSortedJudges = {
    ...portfolioPeriod,
    judges: portfolioPeriod.judges.slice().sort(({ username: u1 }, { username: u2 }) => {
      if (u1 < u2) {
        return -1
      }
      if (u2 > u1) {
        return 1
      }
      return 0
    })
  }

  return (
    <PortfolioPeriodProgressTab
      ratingCountByJudge={ratingCountByJudge}
      numPortfolios={numPortfolios}
      portfolioPeriod={portfolioPeriodSortedJudges}
    />
  )
}
