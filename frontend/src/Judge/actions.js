import { push } from 'connected-react-router'

import SubmissionQuery from './queries/submission.graphql'
import SubmissionsQuery from './queries/submissions.graphql'
import { displayError } from '../shared/actions'
import ShowVotes from './queries/showVotes.graphql'
import GetVote from './queries/entryVote.graphql'
import PortfolioPeriodRatings from './queries/portfolioPeriodRatings.graphql'
import GetPortfolioRating from './queries/portfolioRating.graphql'

export const FETCH_SUBMISSION = 'FETCH_SUBMISSION'
export const FETCH_SUBMISSIONS = 'FETCH_SUBMISSIONS'
export const FETCH_VOTES = 'FETCH_VOTES'
export const FETCH_VOTE = 'FETCH_VOTE'
export const WILL_FETCH_VOTES = 'WILL_FETCH_VOTES'
export const WILL_FETCH_SUBMISSIONS = 'WILL_FETCH_SUBMISSIONS'
export const FETCH_PORTFOLIO_RATINGS = 'FETCH_PORTFOLIO_RATINGS'
export const FETCH_PORTFOLIO_RATING = 'FETCH_PORTFOLIO_RATING'
export const WILL_FETCH_PORTFOLIO_RATINGS = 'WILL_FETCH_PORTFOLIO_RATINGS'

export const fetchSubmission = submissionId => (dispatch, getState, client) => {
  return client
    .query({
      query: SubmissionQuery,
      variables: {
        id: submissionId
      }
    })
    .then(({ data: { submission } }) =>
      dispatch({ type: FETCH_SUBMISSION, payload: submission })
    )
    .catch(err => dispatch(displayError(err.message)))
}

export const fetchSubmissions = showId => (dispatch, getState, client) => {
  const { shared: { auth: { user: { username } } } } = getState()

  dispatch({ type: WILL_FETCH_SUBMISSIONS, payload: showId })
  return client
    .query({
      query: SubmissionsQuery,
      variables: {
        id: showId
      }
    })
    .then(({ data: { submissions } }) =>
      dispatch({
        type: FETCH_SUBMISSIONS,
        payload: {
          submissions: submissions.filter(s => !s.excludeFromJudging),
          username
        }
      })
    )
    .catch(err => dispatch(displayError(err.message)))
}

export const fetchVotes = showId => (dispatch, getState, client) => {
  const { shared: { auth: { user: { username } } } } = getState()

  dispatch({ type: WILL_FETCH_VOTES, payload: showId })
  return client
    .query({
      query: ShowVotes,
      variables: {
        showId,
        username
      }
    })
    .then(({ data: { votes } }) =>
      dispatch({ type: FETCH_VOTES, payload: { votes, showId } })
    )
    .catch(err => dispatch(displayError(err.message)))
}

export const fetchVote = submissionId => (dispatch, getState, client) => {
  const { shared: { auth: { user: { username } } } } = getState()
  return client
    .query({
      query: GetVote,
      variables: {
        entryId: submissionId,
        username
      }
    })
    .then(({ data: { vote } }) => dispatch({ type: FETCH_VOTE, payload: vote }))
    .catch(err => dispatch(displayError(err.message)))
}

export const setViewing = (showId, entryId) => (dispatch, getState, client) => {
  dispatch(push(`/show/${showId}/vote?on=${entryId}`))
}

export const fetchPortfolioRatings = portfolioPeriodId => (dispatch, getState, client) => {
  const { shared: { auth: { user: { username } } } } = getState()

  dispatch({ type: WILL_FETCH_PORTFOLIO_RATINGS, payload: showId })
  return client
    .query({
      query: PortfolioPeriodRatings,
      variables: {
        portfolioPeriodId,
        username
      }
    })
    .then(({ data: { ratings } }) =>
      dispatch({ type: FETCH_PORTFOLIO_RATINGS, payload: { ratings, showId } })
    )
    .catch(err => dispatch(displayError(err.message)))
}

export const fetchPortfolioRating = portfolioId => (dispatch, getState, client) => {
  const { shared: { auth: { user: { username } } } } = getState()
  return client
    .query({
      query: GetPortfolioRating,
      variables: {
        portfolioId,
        username
      }
    })
    .then(({ data: { rating } }) => dispatch({ type: FETCH_PORTFOLIO_RATING, payload: rating }))
    .catch(err => dispatch(displayError(err.message)))
}
