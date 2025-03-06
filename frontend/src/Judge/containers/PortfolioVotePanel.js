import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { fetchVote } from '../actions'
import { displayError } from '../../shared/actions'
import PortfolioVotePanel from '../components/PortfolioVotePanel'
import SendPortfolioVote from '../mutations/sendVote.graphql'

/*
IMPLEMENT CORRECT MUTATION ROUTE ABOVE OTHERWISE WONT ACTUALLY WORK ^^^^^^^^
*/


const mapStateToProps = state => ({
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  fetchPortfolioVote: submissionId => dispatch(fetchPortfolioVote(submissionId)),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(SendPortfolioVote, {
    props: ({ mutate, ownProps }) => ({
      makePortfolioVote: value =>
        mutate({
          variables: {
            input: {
              judgeUsername: ownProps.user.username,
              entryId: parseInt(ownProps.submission.id),
              value
            }
          }
        }).then(() => ownProps.fetchPortfolioVote(ownProps.submission.id))
    })
  })
)(PortfolioVotePanel)
