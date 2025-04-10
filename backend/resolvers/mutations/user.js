import { UserError } from 'graphql-errors'
import db from '../../config/sequelize'

import User from '../../models/user'
import { ADMIN, JUDGE, STUDENT } from '../../constants'

const createUser = (_, args, context, type) => {
  if (context.authType !== ADMIN) {
    throw new UserError('Permission Denied')
  }

  return User.findOne({where: {username: args.input.username}})
    .then((user) => {
      // The user w/ that username doesn't exist, so create them
      if (user === null) {
        const user = {
          ...args.input,
          type
        }
        return User.create(user)
      }

      // Trying to create a user with the same username and role as another user
      if (user.type === type) {
        throw new UserError('Username Already Exists')
      }

      // Students can be elevated to Judges or Admins - No checks needed

      // Judges can be elevated to Admins
      if (user.type === JUDGE && type === STUDENT) {
        throw new UserError('Judges cannot be converted to Students')
      }

      // Admins can't have their role changed
      if (user.type === ADMIN) {
        throw new UserError('Administrators cannot have their role changed')
      }

      user.type = type
      user.firstName = args.input.firstName
      user.lastName = args.input.lastName
      return user.save()
    })
}

export const updateUser = (_, args, context) => {
  if (context.authType !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return User.findOne({where: {username: args.input.username}})
    .then((user) => {

      //the user does not exist so throw an error
      if (user === null) {
        throw new UserError('User Does Not Exist')
      }

      // at the moment we're only using this to update hometown
      // more lines should be added to update other user attributes

      // no need to check type since giving an admin a hometown should be impossible, 
      // and also wouldnt break anything.

      //not sure how the database does with undefined vs null, this is just a precaution
      if (args.input.hometown == undefined){
        user.hometown = null
      }
      else {
      user.hometown = args.input.hometown
      }
      return user.save()
    })

}

export const demoteAdminUsers = async (_, args, context) => {
  if (context.authType !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  if (args.usernames.length < 1) {
    throw new UserError('Please input one or more usernames')　
  }

  return await db.transaction(async (transaction) => {
    // Get all current admins
    const admins = await User.findAll({ where: { type: ADMIN }, transaction })

    if (admins.length <= args.usernames.length) {
      throw new UserError('At least one admin must remain')
    }

    // Get users to be demoted
    const usersToDemote = await User.findAll({
      where: { username: args.usernames },
      transaction
    })

    // Ensure all selected users are actually admins
    const nonAdmins = usersToDemote.filter(user => user.type !== ADMIN)
    if (nonAdmins.length > 0) {
      throw new UserError('One or more selected users are not admins')
    }

    // Perform the update
    await User.update(
      { type: STUDENT }, 
      { where: { username: args.usernames }, transaction }
    )

    const usersNotDemoted = await User.findAll({
      where: { username: !args.usernames },
      transaction
    })

    return usersNotDemoted
  })
}

export const demoteJudgeUsers = async (_, args, context) => {
  if (context.authType !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  if (args.usernames.length < 1) {
    throw new UserError('Please input one or more usernames')
  }

  return await db.transaction(async (transaction) => {
    // Perform the update
    User.update(
      { type: STUDENT }, 
      { where: { username: args.usernames }, transaction }
    )

    const usersNotDemoted = User.findAll({
      where: { username: !args.usernames },
      transaction
    })

    return usersNotDemoted
  })
}


export const createAdmin = (_, args, context) => createUser(_, args, context, ADMIN)
export const createJudge = (_, args, context) => createUser(_, args, context, JUDGE)
