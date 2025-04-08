import React, { useState } from "react"
import { Col, Row } from "reactstrap"
import SinglePortfolioModal from "../../../Student/components/SinglePortfolioModal"
import { STATIC_PATH } from "../../../utils"

export default function ScholarshipSubmissionCard({ scholarshipSubmission }) {

    const [active_portfolio_id, setActivePortfolioId] = useState("");
    if (scholarshipSubmission === undefined
        || scholarshipSubmission.portfolio === undefined
    ) {
        return <React.Fragment></React.Fragment>
    }
    const { portfolio, essayPath, scholarship, scholarshipId } = scholarshipSubmission

    return (
        <Row className="my-3 p-3 border rounded" key={`portfolio-row-${portfolio.id}`}>
            <Col xs={4} lg={3} className="d-flex flex-column flex-lg-row align-items-lg-center">
                <span className="d-lg-none text-muted">Title</span>
                {portfolio.title}
            </Col>
            <Col xs={4} lg={3} className="d-flex flex-column flex-lg-row align-items-lg-center">
                <span className="d-lg-none text-muted">Artist</span>
                {!portfolio.entries[0] ? null
                    //: portfolio.entries[0].student.displayName || `${portfolio.entries[0].student.firstName} ${portfolio.entries[0].student.lastName}`
                    : portfolio.studentUsername + "@rit.edu"
                }
            </Col>
            <Col xs={4} lg={3} className="d-flex flex-column flex-lg-row align-items-lg-center">
                <span className="d-lg-none text-muted">Scholarship</span>
                {!scholarship.name ? null
                    : scholarship.name
                }
            </Col>
            <Col xs={12} lg={3} className="d-flex flex-column flex-lg-row justify-content-lg-end mt-3 mt-lg-0">
                <a
                    className="btn btn-outline-primary mb-3 mb-lg-0 mr-lg-3"
                    href={`${STATIC_PATH}${essayPath}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    View Essay
                </a>
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
}