import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Button } from 'reactstrap'
import moment from 'moment'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaTable from '@fortawesome/fontawesome-free-solid/faTable'
import FaEdit from '@fortawesome/fontawesome-free-solid/faEdit'

function PortfolioPeriodDetailsTab(props){

  return (
    <Fragment>
      <Row>
        <Col>
          {props.portfolioPeriod.description ? (
            <Fragment>
              <dt>Description</dt>
              <dd>{props.portfolioPeriod.description}</dd>
            </Fragment>
          ) : null}
          <dt>Individual Submission Limit</dt>
          <dd>{props.portfolioPeriod.entryCap}</dd>
        </Col>
        <Col>
          <Button
            color='dark'
            className='text-left'
            outline
            block
            tag={Link}
            to={`/portfolio-period/${props.portfolioPeriod.id}/edit`}
            disabled={!moment(props.portfolioPeriod.judgingEndDate).isAfter(moment())}
          >
            <FontAwesomeIcon icon={FaEdit} className='align-middle' /> 
            Edit Portfolio Period Details
          </Button>
          <Button
              color='dark'
              className='text-left'
              outline
              block
              onClick={() => props.downloadPortfolioPeriodCsv()}
            >
              <FontAwesomeIcon icon={FaTable} className='align-middle' />{' '}
              Download Portfolio Period CSV Report
            </Button>
        </Col>
      </Row>
    </Fragment>
  )
}

export default PortfolioPeriodDetailsTab;