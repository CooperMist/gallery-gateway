import React, { useEffect, useState, Component } from "react";
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import SinglePortfolioModal from "../../Student/components/SinglePortfolioModal";
import PortfolioEntry from '../../Student/components/portfolio/PortfolioEntry'
import PortfolioRatingPanel from '../containers/PortfolioRatingPanel'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { setportfolioViewing, fetchPortfolioRatings, fetchPortfolios} from '../actions'


class PortfolioRating extends Component{
    static propTypes = {
        portfolioPeriod: PropTypes.shape({
          id: PropTypes.string
        }).isRequired,
        setPortfolioViewing: PropTypes.func.isRequired,
        fetchPortfolios: PropTypes.func.isRequired,
        portfolio: PropTypes.object,
        previous: PropTypes.shape({
          id: PropTypes.string
        }),
        next: PropTypes.shape({
          id: PropTypes.string
        }),
        fetchPortfolioRatings: PropTypes.func.isRequired,
        rating: PropTypes.object,
        totalPortfolios: PropTypes.number.isRequired,
        currentIndex: PropTypes.number.isRequired
      }

    componentDidMount () {

      this.props.fetchPortfolios()
      this.props.fetchPortfolioRatings()
      document.addEventListener('keydown', this.handleKeyInput)
    }

    componentWillUnmount () {
      document.removeEventListener('keydown', this.handleKeyInput)
    }

    render () {
        const {
          portfolioPeriod,
          setPortfolioViewing,
          portfolio,
          previous,
          next,
          rating,
          totalPortfolios,
          currentIndex
        } = this.props


        // Handle bad state where portfolio period is not an object
        if (typeof portfolioPeriod !== "object") {
            return (
                <Container fluid>
                    <Row className={"d-none d-lg-flex mt-5"}>
                        <Col xs={12}>
                            No portfolio period selected.
                        </Col>
                    </Row>
                </Container>
            )
        }

        // Handle displaying when no portfolio period have been submitted
        if (totalPortfolios === 0) {
            return (
                <Container fluid>
                    <Row className={"d-none d-lg-flex mt-5"}>
                        <Col xs={12}>
                            No portfolios have been submitted to this portfolio period.
                        </Col>
                    </Row>
                </Container>
            )
            }

        return (
            <Container>
                <Row>
                    <Col xs={12} className={"pt-3 pt-lg-5"}>
                        <Link to="/portfolio-periods">Back to Portfolio Periods</Link>
                    </Col>
                </Row>
                <h2>Voting</h2>
                <Row>
                    {currentIndex != totalPortfolios ? 
                        <Col>
                        <p><strong>Created:</strong> {new Date(portfolioPeriod.portfolios[currentIndex].createdAt).toDateString()}</p>
                        <hr />
                        <h2>Entries</h2>
                        <div className='d-flex flex-column'>
                        {portfolioPeriod.portfolios[currentIndex].entries.map((entry) => {
                            return <PortfolioEntry entry={entry} key={entry.id} />
                        })}
                        </div>
                        <Row>
                            <Row>
                            <PortfolioRatingPanel vote={1} /> 
                        </Row> 
                        </Row>
                        {next && next.id ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => { 
                                    setPortfolioViewing(next.id) 
                                }}
                            >
                            Next Portfolio
                            </button>
                        ) : null
                        }
                        {previous && previous.id ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => { 
                                    setPortfolioViewing(previous.id) 
                                }}
                            >
                            Go Back
                            </button>
                        ) : null
                        }
                        </Col>
                        : 
                        <Col>
                        <p>Reached end of portfolios for judging!</p>
                        {previous && previous.id ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => { 
                                    setPortfolioViewing(previous.id) 
                                }}
                            >
                            Go Back
                            </button>
                        ) : null
                        }
                        </Col>
                    }    
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const portfolioPeriodId = ownProps.match.params.id
    const { order = [], loadingRatings = true, loadingPortfolios = true } =
      state.judge.queues[portfolioPeriodId] || {}
    let { on: portfolioId } = queryString.parse(state.router.location.search)
    console.log("portfolioPeriodId: " + portfolioPeriodId + "\n")
    console.log("portfolio collection thing: " + state.judge.queues[portfolioPeriodId] + "\n")
    console.log("portfolios: " + state.portfolios + "\n")
    // If this portfolioId is not in the ordering, throw it out
    if (order.indexOf(portfolioId) < 0) {
      portfolioId = null
    }
  
    // No satisfactory submission ID was found. If the data is loaded, loop
    // through the order and find the first un-voted submission; we'll use that one.
    // In the event that _all_ submissions have votes, use the first submission.
    if (portfolioId === null && !loadingPortfolios && !loadingRatings) {
      for (let i = 0; i < order.length; i++) {
        const candidatePortfolioId = order[i]
        const isRated = !!state.judge.ratings.byPortfolioId[candidatePortfolioId]
        if (!isRated) {
          portfolioId = candidatePortfolioId
          break
        }
      }
  
      // If everything is voted on, just set the current submission to the first one
      if (portfolioId === null) {
        portfolioId = order[0] || null
      }
  
      if (portfolioId !== null) {
        const newQueryString = queryString.stringify({
          ...queryString.parse(ownProps.location.search),
          on: portfolioId
        })
        ownProps.history.replace(`/portfolio-period/${portfolioPeriodId}/rating?${newQueryString}`)
      }
    }
  
    const viewing = portfolioId !== null ? order.indexOf(portfolioId) : null
    const portfolios = state.judge.portfolios
    const ratings = state.judge.ratings
  
    const obj = {
      portfolioPeriod: {
        id: portfolioPeriodId
      },
      portfolio: portfolioId !== null ? portfolios[portfolioId] : null,
      rating: portfolioId !== null ? ratings.byPortfolioId[portfolioId] : null,
      currentIndex: viewing + 1,
      totalPortfolios: order.length
    }
  
    // Show the previous button
    if (viewing !== null && viewing > 0) {
      obj.previous = {
        id: order[viewing - 1]
      }
    }
  
    // Show the next button
    if (viewing !== null && viewing + 1 < order.length) {
      obj.next = {
        id: order[viewing + 1]
      }
    }
  
    return obj
  }
  
  const mapDispatchToProps = (dispatch, ownProps) => {
    const portfolioPeriodId = ownProps.match.params.id
  
    return {
      setPortfolioViewing: portfolioId => dispatch(setPortfolioViewing(portfolioPeriodId, portfolioId)),
      fetchPortfolios: () => dispatch(fetchPortfolios(portfolioPeriodId)),
      fetchPortfolioRatings: () => dispatch(fetchPortfolioRatings(portfolioPeriodId))
    }
  }
  
export default compose(connect(mapStateToProps, mapDispatchToProps))(PortfolioRating)