import React from 'react'
import PropTypes from 'prop-types'

import CheckboxTable from 'shared/components/CheckboxTable'

const columns = [
  {
    Header: 'Last Name',
    accessor: 'lastName'
  },
  {
    Header: 'First Name',
    accessor: 'firstName'
  },
  {
    Header: 'Username',
    accessor: 'username'
  }
]

const UsersTable = props => (
  <CheckboxTable
    columns={columns}
    data={props.users}
    unique='username'
    selected={props.selected}
    onChange={props.onChange}
    defaultSorted={[{ id: 'lastName', desc: false }]}
  />
)

UsersTable.propTypes = {
  users: PropTypes.array.isRequired,
  selected: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

UsersTable.defaultProps = {
  users: [],
  selected: {}
}

export default UsersTable
