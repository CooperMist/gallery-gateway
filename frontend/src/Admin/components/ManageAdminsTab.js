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

import UsersTable from './UsersTable'
import CreateAdminForm from '../containers/CreateAdminForm'

const ReassignButtonContainer = styled.div`
  margin: 2em 0;
`
class ManageAdminsTab extends Component {
  static propTypes = {
    admins: PropTypes.array.isRequired,
    fetchAdmins: PropTypes.func.isRequired
  }

  state = {
    selectedAdmins: {},
    isConfirmationOpen: false
  }

  static defaultProps = {
    admins: []
  }

  componentDidMount () {
    this.props.fetchAdmins()
  }

  //Security Risk: Demoted users will still have Admin Permissions until they logout!
  demoteSelected = () => {
    const admins = Object.keys(this.state.selectedAdmins)

    if (admins.length) {
      this.props
        .demoteAdminUsers(admins)
        .then(() => {
          // this.props.afterAssign(admins)
          // Reset the checkboxes
          this.setState({
            selectedAdmins: {},
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

  handleAdminsChange = selectedAdmins => {
    this.setState({ selectedAdmins })
  }

  render () {
    const { admins } = this.props

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
            If you remove yourself as an Admin, you cannot add yourself back without help from other Admins.
            There must always be at least one Admin in the system.
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
              users={admins}
              selected={this.state.selectedAdmins}
              onChange={this.handleAdminsChange}
            />
        </Col>
        <Col xs='12' md="auto" className='mt-5'>
          <CreateAdminForm />
        </Col>  
        <Col xs="12" md className="d-flex justify-content-md-end align-items-md-start p-2 m-1">
          <ReassignButtonContainer>
            <Button
              color='primary'
              block
              style={{ cursor: 'pointer' }}
              onClick={() => this.onDisplayConfirmation()}
              disabled={
                !Object.keys(this.state.selectedAdmins).length
              }>
              Remove Selected Admins
            </Button>
          </ReassignButtonContainer>
        </Col>
      </Row>
    </Fragment>
    )
  }
}

export default ManageAdminsTab
