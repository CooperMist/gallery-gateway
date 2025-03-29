import DateScalar from './types/dateScalar'
import Group from './types/groupType'
import Entry from './types/entryType'
import Photo from './types/photoType'
import Video from './types/videoType'
import OtherMedia from './types/otherMediaType'
import * as EntryMutations from './mutations/entry'
import * as EntryQuery from './queries/entryQuery'
import Portfolio from './types/portfolioType'
import * as PortfolioMutations from './mutations/portfolio'
import * as PortfolioQuery from './queries/portfolioQuery'
import PortfolioPeriod from './types/portfolioPeriodType'
import * as PortfolioPeriodMutations from './mutations/portfolioPeriod'
import * as PortfolioPeriodQuery from './queries/portfolioPeriodQuery'
import Scholarship from './types/scholarshipType'
import * as ScholarshipQuery from './queries/scholarshipQuery'
import * as ScholarshipMutations from './mutations/scholarship'
import scholarshipSubmission from './types/scholarshipSubmissionType'
import * as ScholarshipSubmissionQuery from './queries/scholarshipSubmissionQuery'
import * as ScholarshipSubmissionMutations from './mutations/scholarshipSubmissions'
import Show from './types/showType'
import * as ShowMutations from './mutations/show'
import * as ShowQuery from './queries/showQuery'
import User from './types/userType'
import * as UserMutations from './mutations/user'
import * as UserQuery from './queries/userQuery'
import Vote from './types/voteType'
import * as VoteMutations from './mutations/vote'
import * as VoteQuery from './queries/voteQuery'
import Rating from './types/portfolioRatingType'
import * as RatingMutations from './mutations/rating'
import * as RatingQuery from './queries/ratingQuery'

export default {
  ...Entry,
  ...Photo,
  ...Video,
  ...OtherMedia,
  ...User,
  ...DateScalar,
  ...Group,
  ...Portfolio,
  ...Scholarship,
  ...scholarshipSubmission,
  ...Show,
  ...PortfolioPeriod,
  ...Vote,
  ...Rating,
  Query: {
    ...EntryQuery,
    ...PortfolioQuery,
    ...ScholarshipQuery,
    ...ScholarshipSubmissionQuery,
    ...ShowQuery,
    ...PortfolioPeriodQuery,
    ...UserQuery,
    ...VoteQuery,
    ...RatingQuery
  },
  Mutation: {
    ...EntryMutations,
    ...PortfolioMutations,
    ...PortfolioPeriodMutations,
    ...ScholarshipMutations,
    ...ScholarshipSubmissionMutations,
    ...ShowMutations,
    ...UserMutations,
    ...VoteMutations,
    ...RatingMutations
  }
}
