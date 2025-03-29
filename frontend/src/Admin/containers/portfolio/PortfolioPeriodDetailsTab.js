import { connect } from 'react-redux'
import { compose } from 'recompose'

import PortfolioPeriodDetailsTab from '../../components/portfolio/PortfolioPeriodDetailsTab'
import { downloadPortfolioPeriodCsv } from '../../actions'
import { getDownloadToken } from '../../../shared/actions'


const mapDispatchToProps = (dispatch, ownProps) => ({
downloadPortfolioPeriodCsv: () => {
    console.log("REACHED!")
  dispatch(getDownloadToken()).then(() =>
      dispatch(downloadPortfolioPeriodCsv(ownProps.portfolioPeriod.id))
    )}
  })

export default compose(
    connect(null, mapDispatchToProps),
  )(PortfolioPeriodDetailsTab)