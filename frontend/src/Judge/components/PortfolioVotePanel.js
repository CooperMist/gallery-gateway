import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, ButtonGroup } from 'reactstrap'
import styled from 'styled-components'

// Vote Values
const ONE = 1
const TWO = 2
const THREE = 3
const FOUR = 4
const FIVE = 5

const PortfolioVotingContainer = styled.div`
  left: 0;
  margin: 10px auto;
  position: absolute;
  width: 100%;

  @media (min-width: 768px) {
    left: 25%;
    width: 50%;
  }
`

class PortfolioVotePanel extends Component {
  static propTypes = {
    handleError: PropTypes.func.isRequired,
    makeVote: PropTypes.func.isRequired,
    vote: PropTypes.shape({
      value: PropTypes.number
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      alertVisible: false,
      alertType: ''
    }
  }

  onDismiss = () => {
    this.setState({
      alertVisible: false,
      alertType: ''
    })
  }

  handleVote = value => {
    const { makePortfolioVote, handleError } = this.props

    makePortfolioVote(value)
      .then(() => {
        this.setState({
          alertVisible: true
        })
        setTimeout(() => {
          this.onDismiss()
        }, 2000)
      })
      .catch(err => handleError(err.message))
  }

  handleKeyInput = e => {
    const { vote } = this.props

    // Listen for key presses. Only update the choice if there is none selected
    // or the key pressed doesn't match the currently selected choice
    if ((e.key === '1') && (!vote || vote.value !== ONE)) {
      // 1 key
      this.handleVote(ONE)
    } else if (
      (e.key === '2') &&
      (!vote || vote.value !== TWO)
    ) {
      // 2 key
      this.handleVote(TWO)
    } else if (
      (e.key === '3') &&
      (!vote || vote.value !== THREE)
    ) {
      // 3 key
      this.handleVote(THREE)
    } else if (
      (e.key === '4') &&
      (!vote || vote.value !== FOUR)
    ) {
      // 4 key
      this.handleVote(FOUR)
    } else if (
      (e.key === '5') &&
      (!vote || vote.value !== FIVE)
    ) {
      // 5 key
      this.handleVote(FIVE)
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyInput)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyInput)
  }

  render () {
    const { vote } = this.props

    return (
      <PortfolioVotingContainer>
        <ButtonGroup style={{ width: '100%' }}>
          <Button
            color={vote && vote.value === ONE ? 'dark' : 'light'}
            size='lg'
            disabled={vote && vote.value === ONE}
            onClick={() => this.handleVote(ONE)}
            style={{ width: '20%', margin: '10px' }}
          >
            One
          </Button>
          <Button
            color={vote && vote.value === TWO ? 'dark' : 'light'}
            size='lg'
            disabled={vote && vote.value === TWO}
            onClick={() => this.handleVote(TWO)}
            style={{ width: '20%', margin: '10px' }}
          >
            Two
          </Button>
          <Button
            color={vote && vote.value === THREE ? 'dark' : 'light'}
            size='lg'
            disabled={vote && vote.value === THREE}
            onClick={() => this.handleVote(THREE)}
            style={{ width: '20%', margin: '10px' }}
          >
           Three
          </Button>
          <Button
            color={vote && vote.value === FOUR ? 'dark' : 'light'}
            size='lg'
            disabled={vote && vote.value === FOUR}
            onClick={() => this.handleVote(FOUR)}
            style={{ width: '20%', margin: '10px' }}
          >
           Four
          </Button>
          <Button
            color={vote && vote.value === FIVE ? 'dark' : 'light'}
            size='lg'
            disabled={vote && vote.value === FIVE}
            onClick={() => this.handleVote(FIVE)}
            style={{ width: '20%', margin: '10px' }}
          >
           Five
          </Button>
        </ButtonGroup>
        <Alert
          color='success'
          isOpen={this.state.alertVisible}
          className='text-center'
          style={{ position: 'fixed', bottom: '0', right: '0', margin: '10px' }}
        >
          Vote Saved
        </Alert>
      </PortfolioVotingContainer>
    )
  }
}

export default PortfolioVotePanel
