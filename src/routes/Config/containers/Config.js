import { connect } from 'react-redux'
import { plus } from './../modules/config'

import Config from './../components/Config.js'

const mapDispatchtoProps = {
  plus
}

const mapStateToProps = (state) => ({
  config: state.config
})

export default connect(mapStateToProps, mapDispatchtoProps)(Config)
