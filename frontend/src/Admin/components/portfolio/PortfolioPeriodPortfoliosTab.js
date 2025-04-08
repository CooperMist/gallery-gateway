import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import SinglePortfolioModal from "../../../Student/components/SinglePortfolioModal";


function PortfolioPeriodPortfoliosTab(props) {
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
        <Container fluid>
            <Row className={"d-none d-lg-flex mt-5"}>
                <Col xs={3} className=" h5">
                    Title
                </Col>
                <Col xs={3} className=" h5">
                    Artist
                </Col>
                <Col xs={3} className=" h5">
                    Score
                </Col>
                <Col xs={3} className="d-flex justify-content-end h5">
                    View
                </Col>
            </Row>

            {[...portfolioPeriod.portfolios]
            .sort((a, b) => (b.score || 0) - (a.score || 0)) // Sort portfolios by score in descending order
            .map((portfolio, i) => {
                return (
                    <Row className="my-3 p-3 border rounded" key={`portfolio-row-${portfolio.id}`}>
                        <Col xs={5} lg={3} className="d-flex flex-column flex-lg-row align-items-lg-center">
                            <span className="d-lg-none text-muted">Title</span>
                            {portfolio.title}
                        </Col>
                        <Col xs={5} lg={3} className="d-flex flex-column flex-lg-row align-items-lg-center">
                            <span className="d-lg-none text-muted">Artist</span>
                            {!portfolio.entries[0] ? null
                                : portfolio.entries[0].student.displayName || `${portfolio.entries[0].student.firstName} ${portfolio.entries[0].student.lastName}`
                            }
                        </Col>
                        <Col xs={5} lg={3} className="d-flex flex-column flex-lg-row align-items-lg-center">
                            <span className="d-lg-none text-muted">Score</span>
                            {portfolio ? portfolio.score : "N/A"}
                        </Col>
                        <Col xs={9} lg={3} className="d-flex flex-column flex-lg-row justify-content-lg-end mt-3 mt-lg-0">
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
                    </Row>
                )
            })}
        </Container>
    )
}

export default PortfolioPeriodPortfoliosTab;