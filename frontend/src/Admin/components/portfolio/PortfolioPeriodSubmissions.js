import React from "react"
import { Col, Container, Row } from "reactstrap"
import ScholarshipSubmissionCard from "../scholarship/ScholarshipSubmissionCard"

function PortfolioPeriodSubmissions(props) {
    const { portfolioPeriod, scholarshipSubmissions } = props
    // Handle bad state where portfolio period is not an object

    if (portfolioPeriod === undefined) {
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
    if (!Array.isArray(scholarshipSubmissions) || scholarshipSubmissions.length === 0) {
        return (
            <Container fluid>
                <Row className={"d-none d-lg-flex mt-5"}>
                    <Col xs={12}>
                        No scholarship submissions have been made to this portfolio period.
                    </Col>
                </Row>
            </Container>
        )
    }


    return (
        <Container fluid>
            <Row className={"d-none d-lg-flex mt-5"}>
                <Col xs={12}>
                    <h2>Scholarship Submissions</h2>
                </Col>
            </Row>


            <Row className={"d-none d-lg-flex mt-5 mb-3"}>
                <Col xs={3} className=" h5">
                    Title
                </Col>
                <Col xs={3} className=" h5">
                    Artist
                </Col>
                <Col xs={3} className=" h5">
                    Scholarship
                </Col>
                <Col xs={3} className="d-flex justify-content-end h5">
                    View
                </Col>
            </Row>

            {scholarshipSubmissions
                .filter(scholarshipSubmission => scholarshipSubmission.portfolioPeriodId == portfolioPeriod.id)
                .map(scholarshipSubmission => {
                    return <ScholarshipSubmissionCard key={scholarshipSubmission.id} 
                        scholarshipSubmission={scholarshipSubmission} />
                })
            }
        </Container>
    )


}

export default PortfolioPeriodSubmissions