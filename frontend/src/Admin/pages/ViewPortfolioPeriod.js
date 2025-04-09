import React, { useEffect, useState } from 'react'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import { TabContent, TabPane, Container, Row, Col } from 'reactstrap'
import { RoutedTabs, NavTab } from 'react-router-tabs'
import { Route, Switch } from 'react-router-dom'
import { compose } from 'recompose'

import PortfolioPeriodDetailsTab from '../containers/portfolio/PortfolioPeriodDetailsTab'
import PortfolioPeriodProgressTab from '../containers/portfolio/PortfolioPeriodProgressTab'
import PortfolioPeriodPortfoliosTab from '../containers/portfolio/PortfolioPeriodPortfoliosTab'
import AssignJudgesPortfolioPeriodTable from '../containers/portfolio/AssignJudgesPortfolioPeriodTable'
import PortfolioPeriodQuery from '../queries/portfolio/portfolioPeriod.graphql'
import Loading from '../../shared/components/Loading'
import NotFound from '../../shared/components/NotFound'
import PortfolioPeriodSubmissions from '../containers/portfolio/PortfolioPeriodSubmissions'

const ViewPortfolioPeriod = props => {
  const { loading } = props
  const [portfolioPeriod, setPortfolioPeriod] = useState(props.portfolioPeriod)

  /**
   * Effect for updating the portfolio period in state
   */
  useEffect(() => {
    if (props.portfolioPeriod) setPortfolioPeriod(props.portfolioPeriod)
  }, [props.portfolioPeriod])

  if (loading) return <Loading />

  if (!portfolioPeriod) return <NotFound />

  return (
    <Container>
      <Row>
        <Col>
          <h1>{portfolioPeriod ? portfolioPeriod.name : ""}</h1>
        </Col>
      </Row>

      <hr />

      {/* We must use 'match.url' as the base because it contains the portfolioPeriod id */}
      <RoutedTabs
        startPathWith={props.match.url}
        className='nav nav-tabs'
        style={{ marginBottom: '1rem' }}
      >
        {/* 'replace={false} makes it so tab navigation is in the browser history */}
        <NavTab exact to='' replace={false} className='nav-item nav-link'>
          Details
        </NavTab>
        <NavTab
          exact
          to='/portfolios'
          replace={false}
          className='nav-item nav-link'
        >
          Portfolios
        </NavTab>
        <NavTab
          exact
          to='/submissions'
          replace={false}
          className='nav-item nav-link'
        >
          Submissions
        </NavTab>
        <NavTab
          exact
          to='/judges/assign'
          replace={false}
          className='nav-item nav-link'
        >
          Judges
        </NavTab>
        <NavTab
          exact
          to='/judges/progress'
          replace={false}
          className='nav-item nav-link'
        >
          Progress
        </NavTab>
      </RoutedTabs>

      <TabContent>
        <TabPane>
          <Switch>
            <Route
              path={`/portfolio-period/:id/judges/assign`}
              render={() => <AssignJudgesPortfolioPeriodTable portfolioPeriod={portfolioPeriod} />}
            />
            <Route
              path={`/portfolio-period/:id/judges/progress`}
              render={() => <PortfolioPeriodProgressTab portfolioPeriod={portfolioPeriod} />}
            />
            <Route
              path={`/portfolio-period/:id/portfolios`}
              render={() => <PortfolioPeriodPortfoliosTab portfolioPeriod={portfolioPeriod} />}
            />
            <Route
              path={`/portfolio-period/:id/submissions`}
              render={() => <PortfolioPeriodSubmissions portfolioPeriod={portfolioPeriod} />}
            />
            <Route
              path="/portfolio-period/:id"
              render={() => <PortfolioPeriodDetailsTab portfolioPeriod={portfolioPeriod} />}
            />
          </Switch>
        </TabPane>
      </TabContent>
    </Container>
  )
}

ViewPortfolioPeriod.propTypes = {
  loading: PropTypes.bool,
  portfolioPeriod: PropTypes.shape({
    name: PropTypes.string
  }),
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired
}

export default compose(
  graphql(PortfolioPeriodQuery, {
    options: ownProps => ({
      variables: {
        id: ownProps.match.params.id
      }
    }),
    props: ({ data: { portfolioPeriod, loading } }) => ({
      portfolioPeriod,
      loading
    })
  })
)(ViewPortfolioPeriod)
