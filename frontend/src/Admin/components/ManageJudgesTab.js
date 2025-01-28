import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter} from 'reactstrap'
import styled from 'styled-components'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'

import CreateJudgeForm from '../containers/CreateJudgeForm'
import UsersTable from './UsersTable'

const ReassignButtonContainer = styled.div`
  margin: 2em 0;
`

class ManageJudgesTab extends Component {
  static propTypes = {
    judges: PropTypes.array.isRequired,
    fetchJudges: PropTypes.func.isRequired
  }

  state = {
    selectedJudges: {},
    isConfirmationOpen: false
  }

  static defaultProps = {
    judges: []
  }

  componentDidMount () {
    this.props.fetchJudges()
  }

  demoteSelected = () => {
    const judges = Object.keys(this.state.selectedJudges)

    if (judges.length) {
      this.props
        .demoteJudgeUsers(judges)
        .then(() => {
          // this.props.afterAssign(judges)
          // Reset the checkboxes
          this.setState({
            selectedJudges: {},
          })
        })
        .catch(err => this.props.handleError(err.message))
    }
  }

  onDismissConfirmation = () => {
    this.setState({
      isConfirmationOpen: false
    })
  }

  onDisplayConfirmation = () => {
    this.setState({
      isConfirmationOpen: true
    })
  }

  handleJudgesChange = selectedJudges => {
    this.setState({ selectedJudges })
  }

  render () {
    const { judges } = this.props

    return (
      <Fragment>
        <Modal
          isOpen={this.state.isConfirmationOpen}
          toggle={this.onDismissConfirmation}
          style={{ top: '25%' }}
        >
          <ModalHeader toggle={this.onDismissConfirmation}>
            Warning{' '}
            <FontAwesomeIcon
              icon={FaExclamationTriangle}
              className='align-middle'
            />
          </ModalHeader>
          <ModalBody>
            <p>
            Removing a judge with this button will revoke their judge role entirely. 
            To unassign judges from specific shows or portfolios, please navigate to the respective pages.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color='secondary'
              onClick={() => this.onDismissConfirmation()}
            >
              Cancel
            </Button>
            <Button
              color='danger'
              onClick={() => {
                this.onDismissConfirmation()
                this.demoteSelected()
              }}
            >
              Continue
            </Button>
          </ModalFooter>
        </Modal>
        <Row >
          <Col xs='12'>
            <UsersTable
                users={judges}
                selected={this.state.selectedJudges}
                onChange={this.handleJudgesChange}
              />
          </Col>
          <Col xs='12' md="auto" className='mt-5'>
            <CreateJudgeForm />
          </Col>  
          <Col xs="12" md className="d-flex justify-content-md-end align-items-md-start p-2 m-1">
            <ReassignButtonContainer>
              <Button
                color='primary'
                block
                style={{ cursor: 'pointer' }}
                onClick={() => this.onDisplayConfirmation()}
                disabled={
                  !Object.keys(this.state.selectedJudges).length
                }>
                Remove Selected Judges
              </Button>
            </ReassignButtonContainer>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export default ManageJudgesTab
