import { UserError } from 'graphql-errors'
import { ADMIN } from '../../constants'
import PortfolioPeriod from '../../models/portfolioPeriod'
import PortfolioPeriodJudge from '../../models/portfolioPeriodJudge'
import moment from 'moment-timezone'

export async function createPortfolioPeriod(_, args, context) {
  // only students can create portfolios
  if (context.authType !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  const { description, name, startDate, endDate, judgingStartDate, judgingEndDate } = args.input

  const entryStart = moment(startDate).tz('America/New_York').startOf('day')
  const entryEnd = moment(endDate).tz('America/New_York').endOf('day')
  const judgingStart = moment(judgingStartDate).tz('America/New_York').startOf('day')
  const judgingEnd = moment(judgingEndDate).tz('America/New_York').endOf('day')

  // Required portfolio period fields
  let newPortfolioPeriod = {
    startDate: entryStart,
    endDate: entryEnd,
    judgingStartDate: judgingStart,
    judgingEndDate: judgingEnd
  }

  // Appened optional fields, check that types match expected schema type prior to appending 
  if (typeof description === "string") { newPortfolioPeriod.description = description };
  if (typeof name === "string") { newPortfolioPeriod.name = name };

  return PortfolioPeriod.create(newPortfolioPeriod)
}


/**
 * Handles updating portfolio periods in the database
 * from a graphql mutation
 */
export function updatePortfolioPeriod(_, args, context) {
  // Only admins can update portfolio periods
  if (context.authType !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return PortfolioPeriod.findByPk(args.id)
    .then((portfolio_period) => {
      return portfolio_period.update(args.input, {
        // All fields that are allowed to be updated
        fields: ['name', 'description',
          'startDate', 'endDate',
          'judgingStartDate', 'judgingEndDate'
        ]
      })
    })
}

export async function assignJudgesToPortfolioPeriod(_, args, context) {
  // Only admins can assign judges portfolio periods
  if (context.authType !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  // destruct expected input
  let { portfolioPeriodId, usernames } = args.input

  // Check for required fields
  portfolioPeriodId = parseInt(portfolioPeriodId)
  if (isNaN(portfolioPeriodId)) throw new UserError('Portfolio Period Id must be a number')
  if (!Array.isArray(usernames) || usernames.length === 0) throw new UserError('Judge username must be a string')


  // create the a portfolio period judge for every judge username passed in
  for (let idx = 0; idx < usernames.length; idx++) {
    const judgeUsername = usernames[idx]
    if (typeof judgeUsername !== "string") continue
    const judge_in_portfolio_period = await PortfolioPeriodJudge.findOne({ where: { portfolioPeriodId, judgeUsername } })
    // Chekc if the judge has already been assigned to this portoflio period
    if (judge_in_portfolio_period !== null) continue
    await PortfolioPeriodJudge.create(
      {
        portfolioPeriodId,
        judgeUsername
      })
  }
  return true
}

export async function removeJudgesFromPortfolioPeriod(_, args, context) {
  // Only admins can assign judges portfolio periods
  if (context.authType !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  // destruct expected input
  let { portfolioPeriodId, usernames } = args

  // Check for required fields
  portfolioPeriodId = parseInt(portfolioPeriodId)
  if (isNaN(portfolioPeriodId)) throw new UserError('Portfolio Period Id must be a number')
  if (!Array.isArray(usernames) || usernames.length === 0) throw new UserError('Judge username must be a string')


  // remove each portfolio period judge
  for (let idx = 0; idx < usernames.length; idx++) {
    const judgeUsername = usernames[idx]
    if (typeof judgeUsername !== "string") continue
    const judge_in_portfolio_period = await PortfolioPeriodJudge.findOne({ where: { portfolioPeriodId, judgeUsername } })
    // Check if the judge is assigned to this portoflio period
    if (judge_in_portfolio_period === null) continue
    await PortfolioPeriodJudge.destroy(
      {
        where: {
          portfolioPeriodId,
          judgeUsername
        }
      }
    )
  }
  return true
}