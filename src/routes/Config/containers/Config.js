import { connect } from 'react-redux';
import { fetchGetConfig, fetchSetConfig } from './../modules/config';

import Config from './../components/Config.js';

const mapDispatchtoProps = {
  fetchGetConfig,
  fetchSetConfig
};

const mapStateToProps = (state) => ({
  config: state.config
});

export default connect(mapStateToProps, mapDispatchtoProps)(Config);
