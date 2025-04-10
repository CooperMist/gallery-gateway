import { connect } from 'react-redux'
import { compose } from 'recompose'

import PortfolioPeriodDetailsTab from '../../components/portfolio/PortfolioPeriodDetailsTab'
import { downloadPortfolioPeriodCsv, downloadPortfolioPeriodCsvJudges } from '../../actions'
import { getDownloadToken } from '../../../shared/actions'


const mapDispatchToProps = (dispatch, ownProps) => ({
downloadPortfolioPeriodCsv: () => {
  dispatch(getDownloadToken()).then(() =>
      dispatch(downloadPortfolioPeriodCsv(ownProps.portfolioPeriod.id))
    )
  },
  downloadPortfolioPeriodCsvJudges: () => {
    dispatch(getDownloadToken()).then(() =>
      dispatch(downloadPortfolioPeriodCsvJudges(ownProps.portfolioPeriod.id))
    )
  }
})

export default compose(
    connect(null, mapDispatchToProps),
  )(PortfolioPeriodDetailsTab)