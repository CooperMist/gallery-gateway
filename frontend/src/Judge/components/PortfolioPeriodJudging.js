import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import SinglePortfolioModal from "../../Student/components/SinglePortfolioModal";
import PortfolioEntry from '../../Student/components/portfolio/PortfolioEntry'
import PortfolioVotePanel from '../containers/PortfolioVotePanel'


function PortfolioPeriodJudgingTab(props) {
    const { portfolioPeriod } = props
    const [active_portfolio_id, setActivePortfolioId] = useState(0);
    const [isEnd, setIsEnd] = useState(false);

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
    if (!Array.isArray(portfolioPeriod.portfolios) || portfolioPeriod.portfolios.length === 0) {
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
                {!isEnd ? 
                    <Col>
                    <p><strong>Created:</strong> {new Date(portfolioPeriod.portfolios[active_portfolio_id].createdAt).toDateString()}</p>
                    <hr />
                    <h2>Entries</h2>
                    <div className='d-flex flex-column'>
                    {portfolioPeriod.portfolios[active_portfolio_id].entries.map((entry) => {
                        return <PortfolioEntry entry={entry} key={entry.id} />
                    })}
                    </div>
                    <Row>
                        <Row>
                        <PortfolioVotePanel vote={1} /> 
                    </Row> 
                    </Row>
                    <button
                    className="btn btn-primary"
                    onClick={() => { if(portfolioPeriod.portfolios.length > active_portfolio_id + 1) {
                        setActivePortfolioId(active_portfolio_id + 1) }
                    else {
                        setIsEnd(true)
                    }}}
                    >
                    
                        Next Portfolio
                    </button>
                    {active_portfolio_id > 0 ? 
                        <button
                            className="btn btn-primary"
                            onClick={() => { 
                                setActivePortfolioId(active_portfolio_id - 1) 
                            }}
                        >
                        Go Back
                        </button>
                        : null
                    }
                    </Col>
                    : 
                    <Col>
                    <p>Reached end of portfolios for judging!</p>
                    {active_portfolio_id > 0 ? 
                        <button
                            className="btn btn-primary"
                            onClick={() => { 
                                setActivePortfolioId(active_portfolio_id) 
                                setIsEnd(false)
                            }}
                        >
                        Go Back
                        </button>
                        : null
                    }
                    </Col>
                }    
            </Row>
        </Container>
    )
}

export default PortfolioPeriodJudgingTab;