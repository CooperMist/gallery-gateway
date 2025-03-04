import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { displayError, getDownloadToken } from '../../shared/actions'
import PortfolioPeriodJudging from '../components/PortfolioPeriodJudging'
import { downloadPortfolioZip } from '../../Admin/actions'
import PortfolioPeriodQuery from "../queries/portfolioPeriod.graphql"


const mapDispatchToProps = (dispatch, { }) => ({
    downloadZip: (porfolioId) =>
        dispatch(getDownloadToken()).then(() =>
            dispatch(downloadPortfolioZip(porfolioId))
        ),
    handleError: message => dispatch(displayError(message))
})

export default compose(
    connect(null, mapDispatchToProps),

    graphql(PortfolioPeriodQuery, {
        options: ownProps => ({
            variables: {
                id: ownProps.match.params.id
            }
        }),
        props: ({ data: { portfolioPeriod, loading } }) => ({
            portfolioPeriod,
            loading
        })
    })
)(PortfolioPeriodJudging)
