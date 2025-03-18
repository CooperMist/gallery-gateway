import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, ButtonGroup } from 'reactstrap'
import styled from 'styled-components'

// Rating Values
const ONE = 1
const TWO = 2
const THREE = 3
const FOUR = 4
const FIVE = 5

const PortfolioRatingContainer = styled.div`
  left: 0;
  margin: 10px auto;
  position: absolute;
  width: 100%;

  @media (min-width: 768px) {
    left: 25%;
    width: 50%;
  }
`

class PortfolioRatingPanel extends Component {
  static propTypes = {
    handleError: PropTypes.func.isRequired,
    makeRating: PropTypes.func.isRequired,
    rating: PropTypes.shape({
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

  handleRating = value => {
    const { makePortfolioRating, handleError } = this.props

    makePortfolioRating(value)
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
    const { rating } = this.props

    // Listen for key presses. Only update the choice if there is none selected
    // or the key pressed doesn't match the currently selected choice
    if ((e.key === '1') && (!rating || rating.value !== ONE)) {
      // 1 key
      this.handleRating(ONE)
    } else if (
      (e.key === '2') &&
      (!rating || rating.value !== TWO)
    ) {
      // 2 key
      this.handleRating(TWO)
    } else if (
      (e.key === '3') &&
      (!rating || rating.value !== THREE)
    ) {
      // 3 key
      this.handleRating(THREE)
    } else if (
      (e.key === '4') &&
      (!rating || rating.value !== FOUR)
    ) {
      // 4 key
      this.handleRating(FOUR)
    } else if (
      (e.key === '5') &&
      (!rating || rating.value !== FIVE)
    ) {
      // 5 key
      this.handleRating(FIVE)
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyInput)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyInput)
  }

  render () {
    const { rating } = this.props

    return (
      <PortfolioRatingContainer>
        <ButtonGroup style={{ width: '100%' }}>
          <Button
            color={rating && rating.value === ONE ? 'dark' : 'light'}
            size='lg'
            disabled={rating && rating.value === ONE}
            onClick={() => this.handleRating(ONE)}
            style={{ width: '20%', margin: '10px' }}
          >
            One
          </Button>
          <Button
            color={rating && rating.value === TWO ? 'dark' : 'light'}
            size='lg'
            disabled={rating && rating.value === TWO}
            onClick={() => this.handleRating(TWO)}
            style={{ width: '20%', margin: '10px' }}
          >
            Two
          </Button>
          <Button
            color={rating && rating.value === THREE ? 'dark' : 'light'}
            size='lg'
            disabled={rating && rating.value === THREE}
            onClick={() => this.handleRating(THREE)}
            style={{ width: '20%', margin: '10px' }}
          >
           Three
          </Button>
          <Button
            color={rating && rating.value === FOUR ? 'dark' : 'light'}
            size='lg'
            disabled={rating && rating.value === FOUR}
            onClick={() => this.handleRating(FOUR)}
            style={{ width: '20%', margin: '10px' }}
          >
           Four
          </Button>
          <Button
            color={rating && rating.value === FIVE ? 'dark' : 'light'}
            size='lg'
            disabled={rating && rating.value === FIVE}
            onClick={() => this.handleRating(FIVE)}
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
          Rating Saved
        </Alert>
      </PortfolioRatingContainer>
    )
  }
}

export default PortfolioRatingPanel
