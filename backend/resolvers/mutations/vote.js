import Vote from '../../models/vote'
import Entry from '../../models/entry'
import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE, STUDENT } from '../../constants'

function judgeIsAllowedToVote (judgeUsername, entryId, userType) {
  // Admins can vote on any show
  if (userType === ADMIN) {
    return Promise.resolve()
  }

  // Students may not vote
  if (userType === STUDENT) {
    return Promise.reject(new UserError('Students may not vote'))
  }

  // Judges may only vote on entries submitted to shows they've been assigned to.
  return User.findByPk(judgeUsername).then(judge => {
    return Entry.findByPk(entryId).then(entry => {
      if (!entry) {
        return Promise.reject(new UserError('Cannot find entry'))
      }
      return judge.getShows().then(assignedShows => {
        // Make sure the array contains the show this entry is part of
        const allowedToVote = assignedShows.filter(show => show.id === entry.showId)
        if (allowedToVote.length === 0) {
          return Promise.reject(new UserError('Judge is not allowed to vote on this entry'))
        }
        return Promise.resolve()
      })
    })
  })
}

export function vote (_, args, context) {
  // Make sure judge is voting as themself
  const isRequestingOwnJudgeUser = context.username !== undefined &&
    (context.authType === JUDGE || context.authType === ADMIN) &&
    context.username === args.input.judgeUsername
  if (!isRequestingOwnJudgeUser) {
    throw new UserError('Permission Denied')
  }
  // Make sure judge is allowed to vote on this entry
  const input = args.input
  return judgeIsAllowedToVote(input.judgeUsername, input.entryId, context.authType)
    .then(() => {
      return Vote
        .findOrCreate({
          where: {
            judgeUsername: input.judgeUsername,
            entryId: input.entryId
          },
          defaults: {
            value: input.value
          }
        })
        .then((res) => {
          const vote = res[0]
          const created = res[1]
          if (created) {
            return vote
          } else {
            return vote.update({ value: input.value })
          }
        })
    })
    .then(vote => {
      // Update the score of the entry
      console.log("Entry ID" + vote.entryId)
      return Entry.findByPk(vote.entryId).then(entry => {
        return entry.getScore().then(score => {
          return entry.update({ score }).then(() => vote)
        })
      })
    })
}