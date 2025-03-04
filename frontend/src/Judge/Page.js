import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Review from './pages/Review'
import Vote from './pages/Vote'
import PortfolioPeriodPortfolios from './containers/PortfolioPeriodPortfolios'
import PortfolioPeriodJudging from './containers/PortfolioPeriodJudging'

import Layout from './components/Layout'
import NotFound from '../shared/components/NotFound'

const Judge = () => (
  <Layout>
    <Switch>
      <Route exact path='/' component={Dashboard} />
      <Route exact path='/portfolio-period/:id/portfolios' component={PortfolioPeriodPortfolios} />
      <Route exact path='/portfolio-period/:id/portfolio-judging' component={PortfolioPeriodJudging} />
      <Route exact path='/portfolio-periods' component={Dashboard} />
      <Route exact path='/show/:id' component={Review} />
      <Route exact path='/show/:id/vote' component={Vote} />
      <Route component={NotFound} />
    </Switch>
  </Layout>
)

export default Judge
