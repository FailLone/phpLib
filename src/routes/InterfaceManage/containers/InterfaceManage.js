import { connect } from 'react-redux';
import { fetchGetNormal, fetchGetAbnormal } from './../modules/interfaceManage';

import InterfaceManage from './../components/InterfaceManage.js';

const mapDispatchtoProps = {
  fetchGetNormal,
  fetchGetAbnormal
};

const mapStateToProps = (state) => ({
  interfaceManage: state.interfaceManage
});

export default connect(mapStateToProps, mapDispatchtoProps)(InterfaceManage);
