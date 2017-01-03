import React, {Component, PropTypes} from 'react';
import Toolbar from '../components/Toolbar';
import Chart from '../components/Chart';
import {mapValues} from 'lodash';
import lazyCache from 'react-lazy-cache';
import { connect } from 'react-redux';
import { fetchGetConfigData, fetchGetPathData, setPathParams, getTime } from '../modules/toolbar';

const mapDispatchtoProps = {
  fetchGetConfigData,
  fetchGetPathData,
  setPathParams,
  getTime
};

const mapStateToProps = (state) => ({
  toolbar: state.toolbar.data,
  params: state.toolbar.params,
  paths: state.toolbar.paths,
  loading: state.toolbar.loading,
  times: state.toolbar.times,
  timeLoading: state.toolbar.timeLoading
});

class Neck extends Component {
  // constructor(props) {
  //   super(props);
  //   this.initData = (data) => {
  //     let ret = {};
  //     ret.graph = mapValues(data, o => ({
  //       group: o.ral_log ? o.ral_log.group : {},
  //       count: o.ral_count_max
  //     }));
  //     return ret;
  //   };
  // }
  componentWillMount() {
    // this.cache = lazyCache(this, {
    //   data: {
    //     params: ['data'],
    //     fn: this.initData
    //   }
    // });
  }
  componentWillReceiveProps(nextProps) {
    // this.cache.componentWillReceiveProps(nextProps);
  }
  render() {
    return (
      <div>
        <Toolbar config={this.props.toolbar} action={this.props.fetchGetConfigData} params={this.props.params} setParams={this.props.setPathParams} search={this.props.fetchGetPathData} />
        <Chart loading={this.props.loading} data={this.props.paths.data && this.props.paths.data.list ? this.props.paths.data.list : []} getTime={this.props.getTime} time={this.props.times} timeLoading={this.props.timeLoading} />
      </div>
    );
  }
}

Neck.propTypes = {

};

Neck.defaultProps = {
};

export default connect(mapStateToProps, mapDispatchtoProps)(Neck);
