import { compose } from 'recompose'
import { connect } from 'react-redux'

import ManageAdminsTab from '../components/ManageAdminsTab'
import { fetchAdmins } from '../actions'

const mapStateToProps = state => ({
  admins: Object.values(state.admin.admins)
})

const mapDispatchToProps = dispatch => ({
  fetchAdmins: () => dispatch(fetchAdmins())
})

export default compose(

  //Connections Needed!
  
  connect(mapStateToProps, mapDispatchToProps)
)(ManageAdminsTab)
