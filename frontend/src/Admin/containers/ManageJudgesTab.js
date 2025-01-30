import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { displayError } from '../../shared/actions'

import ManageJudgesTab from '../components/ManageJudgesTab'
import JudgesQuery from '../queries/judges.graphql'
import demoteJudgeUsersMutation from '../mutations/demoteJudgeUsers.graphql'
import { fetchJudges, demoteJudges } from '../actions'

const mapStateToProps = state => ({
  judges: Object.values(state.admin.judges)
})

const mapDispatchToProps = (dispatch, { showId }) => ({
  demoteJudges: admin => dispatch(demoteJudges(admin)),
  fetchJudges: () => dispatch(fetchJudges()),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(demoteJudgeUsersMutation, {
    props: ({ ownProps, mutate }) => ({
      demoteJudgeUsers: usernames =>
        mutate({
          variables: {
            usernames
          },
          refetchQueries: [
            {
              query: JudgesQuery
            }
          ]
        }).then(({data: judges}) => demoteJudges(judges))
    })
  })
)(ManageJudgesTab)
