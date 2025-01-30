import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { displayError } from '../../shared/actions'

import AdminsQuery from '../queries/admins.graphql'
import demoteAdminUsersMutation from '../mutations/demoteAdminUsers.graphql'
import ManageAdminsTab from '../components/ManageAdminsTab'
import { fetchAdmins, demoteAdmins } from '../actions'

const mapStateToProps = state => ({
  admins: Object.values(state.admin.admins)
})

const mapDispatchToProps = dispatch => ({
  demoteAdmins: () => dispatch(demoteAdmins()),
  fetchAdmins: () => dispatch(fetchAdmins()),
  handleError: message => dispatch(displayError(message))
})

export default compose(
connect(mapStateToProps, mapDispatchToProps),
  graphql(demoteAdminUsersMutation, {
    props: ({ ownProps, mutate }) => ({
      demoteAdminUsers: usernames =>
        mutate({
          variables: {
            usernames
          },
          refetchQueries: [
            {
              query: AdminsQuery
            }
          ]
        }).then(({}) => demoteAdmins(usernames))
    })
  })
)(ManageAdminsTab)
