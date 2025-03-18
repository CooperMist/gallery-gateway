import Vote from '../../models/vote'
import Entry from '../../models/entry'
import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE, STUDENT } from '../../constants'
import PortfolioPeriodJudge from '../../models/portfolioPeriodJudge'

function judgeIsAllowedToVote(judgeUsername, userType, portfolioPeriodId) {
    // Admins can vote on any show
    if (userType === ADMIN) {
      return Promise.resolve();
    }
  
    // Students may not vote
    if (userType === STUDENT) {
      return Promise.reject(new UserError('Students may not vote'));
    }
  
    // Judges may only vote on entries submitted to shows they've been assigned to.
    return PortfolioPeriodJudge.findOne({
      where: {
        portfolioPeriodId: portfolioPeriodId,
        judgeUsername: judgeUsername,
      },
    }).then((portfolioPeriodJudge) => {
      if (!portfolioPeriodJudge) {
        return Promise.reject(
          new UserError('Judge is not assigned to this portfolio period')
        );
      }
    }
    );
}

//EVERYTHING ABOVE IS FINE, NEED TO WORK ON BELOW

export function rating(_, args, context) {
    // Ensure the judge is voting as themselves
    const isRequestingOwnJudgeUser =
      context.username !== undefined &&
      (context.authType === JUDGE || context.authType === ADMIN) &&
      context.username === args.input.judgeUsername;
  
    if (!isRequestingOwnJudgeUser) {
      throw new UserError('Permission Denied');
    }
  
    const input = args.input;
  
    // Validate if the judge is allowed to vote on the portfolio
    return judgeIsAllowedToVote(input.judgeUsername, context.authType, input.portfolioPeriodId)
      .then(() => {
        // Create or update the vote for the portfolio
        return PortfolioRatings.findOrCreate({
          where: {
            judgeUsername: input.judgeUsername,
            portfolioId: input.portfolioPeriodId,
          },
          defaults: {
            rating: input.value,
          },
        }).then((res) => {
          const rating = res[0];
          const created = res[1];
          if (created) {
            return rating;
          } else {
            return rating.update({ rating: input.value }).then(() => rating);
          }
        });
      })
}