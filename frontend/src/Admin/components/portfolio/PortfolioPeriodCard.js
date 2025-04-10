import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button, Row, Col, Badge } from 'reactstrap'
import moment from 'moment'
import Moment from 'react-moment'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaImage from '@fortawesome/fontawesome-free-regular/faImage'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`

// NOTE: Only 1 child should be provided
const FormattedDate = (props) => (
  <Moment
    title={moment(props.children).format('MMMM D, YYYY hh:mm:ss a')}
    format='MMMM D, YYYY'
  >
    {props.children}
  </Moment>
)

function PortfolioPeriodCard(props) {

  const {
    startDate,
    endDate,
    judgingStartDate,
    judgingEndDate
  } = props

  const now = moment()
  const isPortfolioPeriodInFuture = now.isBefore(moment(startDate))
  const isPortfolioPeriodInSubmission = now.isAfter(moment(startDate)) && now.isBefore(moment(endDate))
  const isPortfolioPeriodBetweenSubmissionAndJudging = now.isAfter(moment(endDate)) && now.isBefore(moment(judgingStartDate))
  const isPortfolioPeriodInJudging = now.isAfter(moment(judgingStartDate)) && now.isBefore(moment(judgingEndDate))
  const isPortfolioPeriodClosed = now.isAfter(moment(judgingEndDate))

  const renderOpenClose = (opens, closes) => (
    <Fragment>
      <dl style={{ width: '50%' }} className='d-inline-block'>
        <dt>{moment().isBefore(moment(opens)) ? 'Opens:' : 'Opened:'}</dt>
        <dd><FormattedDate>{opens}</FormattedDate></dd>
      </dl>
      <dl style={{ width: '50%' }} className='d-inline-block'>
        <dt>{moment().isBefore(moment(closes)) ? 'Closes:' : 'Closed:'}</dt>
        <dd><FormattedDate>{closes}</FormattedDate></dd>
      </dl>
    </Fragment>
  )

  const renderSubmissionSummary = (props) => {
    const totalPortfolios = Array.isArray(props.portfolios) ? props.portfolios.length : 0;

    return (
      <Fragment>
        <div>
          <FontAwesomeIcon icon={FaImage} className='mr-2' />
          <h6 className='text-bold d-inline-block'>
            Portfolios: <Badge color='dark'>{totalPortfolios}</Badge>
          </h6>
        </div>
      </Fragment>
    )
  }

  const renderClosedPortfolioPeriod = () => (
    <Row>
      <Col className='mb-3'>
        <h4>Closed Portfolio Period</h4>
        <FormattedDate>{startDate}</FormattedDate>
        {' - '}
        <FormattedDate>{judgingEndDate}</FormattedDate>
      </Col>
    </Row>
  )

  const renderBody = (props) => {

    if (isPortfolioPeriodClosed) {
      return renderClosedPortfolioPeriod();
    }

    // Dynamically set the sub-heading based on the portfolio period state
    let subHeading1 = ''
    let subHeading2 = ''
    let border = ''

    if (isPortfolioPeriodInFuture) {
      subHeading1 = 'Pre Portfolio Period'
      subHeading2 = 'Pre Judging'
    } else if (isPortfolioPeriodInSubmission) {
      subHeading1 = 'Accepting Submissions'
      subHeading2 = 'Pre Judging'
      border = "border border-primary"
    } else if (isPortfolioPeriodBetweenSubmissionAndJudging) {
      subHeading1 = 'No Longer Accepting Submissions'
      subHeading2 = 'Pre Judging'
      border = 'border border-warning'
    } else if (isPortfolioPeriodInJudging) {
      subHeading1 = 'No Longer Accepting Submissions'
      subHeading2 = 'Judging In Progress'
      border = 'border border-secondary'
    }

    // We render Submission Period and Judging Period in two columns,
    // except for when the portfolio period is in submission, we render the summary info
    // in the second column and move the judging info below the submission period info
    return (
      <Row>
        <Col xs='12' md='6'>
          <h4>Submission Period</h4>
          <h6>{subHeading1}</h6>
          {renderOpenClose(startDate, endDate)}
          {isPortfolioPeriodInSubmission ? (
            <Fragment>
              <h4>Judging Period</h4>
              <h6>{subHeading2}</h6>
              {renderOpenClose(judgingStartDate, judgingEndDate)}
            </Fragment>
          ) : null}
        </Col>
        <Col xs='12' md='6'>
          {isPortfolioPeriodInSubmission
            ? renderSubmissionSummary(props)
            : (
              <Fragment>
                <h4>Judging Period</h4>
                <h6>{subHeading2}</h6>
                {renderOpenClose(judgingStartDate, judgingEndDate)}
              </Fragment>
            )}
        </Col>
      </Row>
    )
  }

  const renderButtons = (props) => (
    <Row>
      <Col>
        <Button
          color='primary'
          className='mr-4'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`/portfolio-period/${props.id}`}
          block
          outline
        >
          View Details
        </Button>
        <Button
          color='primary'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`/portfolio-period/${props.id}/portfolios`}
          block
          outline
        >
          View Portfolios
        </Button>
      </Col>
      <Col>
        <Button
          className='mr-4'
          color='primary'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`/portfolio-period/${props.id}/submissions`}
          block
          outline
        >
          View Submissions
        </Button>
        <Button
          color='primary'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`/portfolio-period/${props.id}/judges/assign`}
          block
          outline
        >
          Assign Judges
        </Button>
        <Button
          color='primary'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`/portfolio-period/${props.id}/judges/progress`}
          block
          outline
        >
          View Progress
        </Button>
      </Col>
    </Row>
  )

  let border = "";

  if (isPortfolioPeriodInSubmission) {
    border = "border border-primary"
  } else if (isPortfolioPeriodBetweenSubmissionAndJudging) {
    border = 'border border-warning'
  } else if (isPortfolioPeriodInJudging) {
    border = 'border border-info'
  }


  return (
    <Card className={border}>
      <h2>
        <Link to={`portfolio-period/${props.id}`}>{props.name}</Link>
      </h2>
      {renderBody(props)}
      {renderButtons(props)}
    </Card>
  )

}

PortfolioPeriodCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  judgingStartDate: PropTypes.string.isRequired,
  judgingEndDate: PropTypes.string.isRequired,
  portfolios: PropTypes.array,
}

export default PortfolioPeriodCard