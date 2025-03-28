import PortfolioRatings from '../../models/portfolioRating'
import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { ADMIN, JUDGE, STUDENT } from '../../constants'
import PortfolioPeriodJudge from '../../models/portfolioPeriodJudge'
import Portfolio from '../../models/portfolio'

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
        portfolioPeriodId: portfolioId,
        judgeUsername: judgeUsername,
      },
    }).then((portfolioPeriodJudge) => {
      if (!portfolioPeriodJudge) {
        return Promise.reject(
          new UserError('Judge is not assigned to this portfolio period')
        );
      }
      return Promise.resolve();
    }
    );
}


export function rating(_, args, context) {
  console.log("LOG In Rating");
  
    // Ensure the judge is voting as themselves
    const isRequestingOwnJudgeUser =
      context.username !== undefined &&
      (context.authType === JUDGE || context.authType === ADMIN) &&
      context.username === args.input.judgeUsername;
  
    if (!isRequestingOwnJudgeUser) {
      throw new UserError('Permission Denied');
    }

    const input = args.input;
  
    // Validate if the judge is allowed to rate on the portfolio
    return judgeIsAllowedToVote(input.judgeUsername, context.authType, input.portfolioPeriodId)
      .then(() => {
        // Create or update the vote for the portfolio
        return PortfolioRatings.findOrCreate({
          where: {
            judgeUsername: input.judgeUsername,
            portfolioId: input.portfolioId,
          },
          defaults: {
            rating: input.rating,
          },
        }).then((res) => {
          const rating = res[0];
          const created = res[1];
          console.log("Rating found: " + rating + "created: " + created);
          if (created) {
            return rating;
          } else {
            return rating.update({ rating: input.rating }).then(() => rating);
          }
        })
      })
      .then((rating) => {

        return Portfolio.findByPk(input.portfolioId)
          .then((portfolio) => {
            if (!portfolio) {
              throw new UserError('Portfolio not found')
            }
            // Get and log the score of the portfolio
            return portfolio.getScore().then(newScore => {
              return portfolio.update({ score: newScore }).then(() => rating)
            })
          })
      })
}