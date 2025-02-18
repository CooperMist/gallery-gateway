import React, { useEffect, useState } from 'react'
import { Link, NavLink, Route, useLocation } from 'react-router-dom'
import { Container, Row, Col, Button, Carousel, CarouselItem, NavItem, Nav } from 'reactstrap'

import Shows from '../containers/Shows'
import PortfolioPeriods from '../containers/portfolio/PortfolioPeriods'
import Scholarships from '../containers/scholarship/Scholarships'

const FEATURE__SHOWS = 0;
const FEATURE__PORTFOLIO_PERIODS = 1;
const FEATURE__SCHOLARSHIPS = 2;

const Dashboard = () => {
  const [active_feature, setActiveFeature] = useState(FEATURE__SHOWS);

  /**
   * Effect for updating the active feature in state
   * decides active feature based of path name in URL
   * Defaults to the shows tab
   */
  useEffect(() => {
    const path = window.location.pathname;
    switch (path) {
      case "/portfolio-period":
        setActiveFeature(FEATURE__PORTFOLIO_PERIODS);
        return;
      case "/scholarships":
        setActiveFeature(FEATURE__SCHOLARSHIPS);
        return;
      default:
        setActiveFeature(FEATURE__SHOWS);
        return;
    }
  })


  return (
    <Container>
      <Row className='align-items-baseline'>
        <Col>
          <h1>Dashboards</h1>
        </Col>
        <Col md='3'>
          <Button
            color='primary'
            className='btn-block mb-3 mb-lg-0'
            style={{ cursor: 'pointer' }}
            tag={Link}
            to='/show/new'
          >
            Create Show
          </Button>
        </Col>
        <Col md='3'>
          <Button
            color='primary'
            className='btn-block'
            style={{ cursor: 'pointer' }}
            tag={Link}
            to='/portfolio-period/new'
          >
            Create Portfolio Period
          </Button>
        </Col>
        <Col md='3'>
          <Button
            color='primary'
            className='btn-block'
            style={{ cursor: 'pointer' }}
            tag={Link}
            to='/scholarships/new'
          >
            Create Scholarship
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="my-3">
          <Nav tabs>
            <NavItem>
              <Link className={`nav-link${active_feature === FEATURE__SHOWS ? " active" : ""}`} to='/show'>Shows</Link>
            </NavItem>
            <NavItem>
              <Link className={`nav-link${active_feature === FEATURE__PORTFOLIO_PERIODS ? " active" : ""}`} to="/portfolio-period">Portfolio Periods</Link>
            </NavItem>
            <NavItem>
              <Link className={`nav-link${active_feature === FEATURE__SCHOLARSHIPS ? " active" : ""}`} to="/scholarships">Scholarships</Link>
            </NavItem>
          </Nav>
        </Col>
        <Col>
          <Carousel activeIndex={active_feature} interval={false} next={() => { }} previous={() => { }}>
            <CarouselItem key={'carousel-item-shows'}>
              <h1>Shows</h1>
              <Shows />
            </CarouselItem>

            <CarouselItem key={'carousel-item-portfolio-periods'}>
              <h1 className='my-3'>Portfolio Periods</h1>
              <PortfolioPeriods />
            </CarouselItem>

            <CarouselItem key={'carousel-item-scholarships'}>
              <h1 className='my-3'>Scholarships</h1>
              <Scholarships />
            </CarouselItem>
          </Carousel>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
