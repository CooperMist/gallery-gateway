import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { fetchPortfolioRating } from '../actions'
import { displayError } from '../../shared/actions'
import PortfolioRatingPanel from '../components/PortfolioRatingPanel'
import SendPortfolioRating from '../mutations/sendPortfolioRating.graphql'

const mapStateToProps = state => ({
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  fetchPortfolioRating: portfolioId => dispatch(fetchPortfolioRating(portfolioId)),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(SendPortfolioRating, {
    props: ({ mutate, ownProps }) => ({
      makePortfolioRating: rating =>
        mutate({
          variables: {
            input: {
              portfolioPeriodId: parseInt(ownProps.portfolio.portfolioPeriodId),
              portfolioId: parseInt(ownProps.portfolio.id),
              rating,
              judgeUsername: ownProps.user.username
            }
          }
        }).then(() => ownProps.fetchPortfolioRating(ownProps.portfolio.id))
    })
  })
)(PortfolioRatingPanel)
