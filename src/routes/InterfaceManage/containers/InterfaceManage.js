import { connect } from 'react-redux';
import { fetchGetNormal, fetchGetAbnormal } from './../modules/interfaceManage';

import InterfaceManage from './../components/InterfaceManage.js';

const mapDispatchtoProps = {
  fetchGetNormal,
  fetchGetAbnormal
};

const mapStateToProps = (state) => ({
  data: state.interfaceManage.data
});

export default connect(mapStateToProps, mapDispatchtoProps)(InterfaceManage);
