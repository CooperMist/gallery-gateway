import React, { Fragment } from "react";
import PropTypes from 'prop-types'
import { Row, Col, Progress, Button } from 'reactstrap'
import { Link } from 'react-router-dom'


// Calculates a Bootstrap color for the given fractional progress, given
// as a number from 0 to 1.
const colorForProgress = progress => {
  if (progress < 0.1) {
    return 'danger'
  }
  if (progress < 0.25) {
    return 'warning'
  }
  if (progress < 1) {
    return null // default color
  }
  return 'success'
}


const PortfolioPeriodProgressTab = ({ ratingCountByJudge, numPortfolios, portfolioPeriod }) => (
  <Fragment>
    <Row style={{ marginBottom: '1.5rem' }}>
      <Col className='text-right'>
        <Link to={`/portfolio-period/${portfolioPeriod.id}/judges/assign`}>
          <Button color='primary'>Assign Judges</Button>
        </Link>
      </Col>
    </Row>
    {portfolioPeriod.judges.length > 0 ? (
      portfolioPeriod.judges.map(judge => {
        const numRatings = ratingCountByJudge[judge.username] || 0
        return (
          <Row key={judge.username} style={{ marginBottom: '1.5rem' }}>
            <Col md='3'>
              {judge.firstName} {judge.lastName} ({judge.username})
            </Col>
            <Col>
              {numRatings ? (
                <Progress
                  value={numRatings / numPortfolios * 100}
                  color={colorForProgress(numRatings / numPortfolios)}
                >
                  {numRatings} / {numPortfolios}
                </Progress>
              ) : (
                <div className='text-center text-muted'>
                  No submissions have been judged.
                </div>
              )}
            </Col>
          </Row>
        )
      })
    ) : (
      <div className='text-center'>
        No judges are assigned to this portfolio period. Visit the{' '}
        <Link to={`/portfolio-period/${portfolioPeriod.id}/judges/assign`}>"Assign Judges"</Link> page
        to assign judges to this portfolio period.
      </div>
    )}
  </Fragment>
)

PortfolioPeriodProgressTab.propTypes = {
  ratingCountByJudge: PropTypes.object.isRequired,
  numPortfolios: PropTypes.number.isRequired,
  portfolioPeriod: PropTypes.shape({
    id: PropTypes.string.isRequired,
    judges: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired
      })
    ).isRequired
  })
}

export default PortfolioPeriodProgressTab;