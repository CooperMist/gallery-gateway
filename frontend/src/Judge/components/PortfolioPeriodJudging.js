import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import SinglePortfolioModal from "../../Student/components/SinglePortfolioModal";
import PortfolioEntry from '../../Student/components/portfolio/PortfolioEntry'


function PortfolioPeriodJudgingTab(props) {
    const { portfolioPeriod } = props
    const [active_portfolio_id, setActivePortfolioId] = useState("");

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
                    JUDGING PAGE WAHOOO!!!!
                </Col>
            </Row>
            <Row className={"d-none d-lg-flex mt-5"}>
                <Col xs={4} className=" h5">
                    Title
                </Col>
                <Col xs={4} className=" h5">
                    Artist
                </Col>
                <Col xs={4} className="d-flex justify-content-end h5">
                    View
                </Col>
            </Row>
            {portfolioPeriod.portfolios.map((portfolio, i) => {
                return (
                    <Row className="my-3 p-3 border rounded" key={`portfolio-row-${portfolio.id}`}>
                        <Col xs={6} lg={4} className="d-flex flex-column flex-lg-row align-items-lg-center">
                            <span className="d-lg-none text-muted">Title</span>
                            {portfolio.title}
                        </Col>
                        <Col xs={6} lg={4} className="d-flex flex-column flex-lg-row align-items-lg-center">
                            <span className="d-lg-none text-muted">Artist</span>
                            {!portfolio.entries[0] ? null
                                : portfolio.entries[0].student.displayName || `${portfolio.entries[0].student.firstName} ${portfolio.entries[0].student.lastName}`
                            }
                        </Col>
                        <Col xs={12} lg={4} className="d-flex flex-column flex-lg-row justify-content-lg-end mt-3 mt-lg-0">
                            <button
                                className="btn btn-outline-primary mb-3 mb-lg-0 mr-lg-3"
                                onClick={() => { props.downloadZip(portfolio.id) }}
                            >
                                Download Portfolio
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => { setActivePortfolioId(portfolio.id) }}
                            >
                                View Portfolio
                            </button>
                        </Col>
                        <SinglePortfolioModal
                            isOpen={portfolio.id === active_portfolio_id}
                            toggle={() => { setActivePortfolioId("") }}
                            portfolio={portfolio}
                        />

                        <Col>
                            <h2>Details</h2>
                            <p><strong>Created:</strong> {new Date(portfolio.createdAt).toDateString()}</p>
                            <hr />
                            <h2>Entries</h2>
                            <div className='d-flex flex-column'>
                            {portfolio.entries.map((entry) => {
                                return <PortfolioEntry entry={entry} key={entry.id} />
                            })}
                            </div>
                            <button
                            className="btn btn-primary"
                            onClick={() => { setActivePortfolioId(portfolio.id) }}
                            >
                                Submit Vote
                            </button>
                        </Col>

  
                    </Row>
                )
            })}
        </Container>
    )
}

export default PortfolioPeriodJudgingTab;