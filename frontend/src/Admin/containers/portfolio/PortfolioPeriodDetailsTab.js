import { connect } from 'react-redux'
import { compose } from 'recompose'

import PortfolioPeriodDetailsTab from '../../components/portfolio/PortfolioPeriodDetailsTab'

const mapDispatchToProps = (dispatch, ownProps) => ({
downloadPortfolioPeriodCsv: () =>
    dispatch(getDownloadToken()).then(() =>
      dispatch(downloadPortfolioPeriodCsv(ownProps.portfolioPeriod.id))
    )
  })

export default compose(
    connect(null, mapDispatchToProps),
  )(PortfolioPeriodDetailsTab)