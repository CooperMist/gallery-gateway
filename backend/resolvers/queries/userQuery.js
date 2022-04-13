import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { STUDENT, ADMIN, JUDGE } from '../../constants'

export function user (_, args, context) {
  const isRequestingOwnUser = context.username !== undefined && context.username === args.id
  if (context.authType !== ADMIN && !isRequestingOwnUser) {
    throw new UserError('Permission Denied')
  }
  return User.findByPk(args.id)
}

export function self (_, __, context) {
  if (!context.username) {
    throw new UserError('Permission Denied')
  }
  return User.findByPk(context.username)
}

export function users (_, args, context) {
  if (context.authType !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  if (args.type === STUDENT) {
    return User.findAll({
      where: {
        type: STUDENT
      }
    })
  } else if (args.type === JUDGE) {
    return User.findAll({
      where: {
        type: JUDGE
      }
    })
  } else if (args.type === ADMIN) {
    return User.findAll({
      where: {
        type: ADMIN
      }
    })
  } else {
    return User.findAll()
  }
}
