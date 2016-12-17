import { connect } from 'react-redux'
import { plus } from './../modules/interfaceManage'

import InterfaceManage from './../components/InterfaceManage.js'

const mapDispatchtoProps = {
  plus
}

const mapStateToProps = (state) => ({
  config: state.config
})

export default connect(mapStateToProps, mapDispatchtoProps)(InterfaceManage)
