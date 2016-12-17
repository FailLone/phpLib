import React, {Component} from 'react';
import { Table, Switch } from 'antd';
import TimingChart from './TimingChart';
import GroupList from './GroupList';
import SQLList from './SQLList';
import {mapValues} from 'lodash';
import lazyCache from 'react-lazy-cache';

const columns = [
  { title: '接口名称', dataIndex: 'api_path', key: 'api_path' },
  { title: 'QPS', dataIndex: 'qps_max', key: 'qps_max' },
  { title: '响应时间', dataIndex: 'request_time_avg', key: 'request_time_avg' },
  { title: '调用次数', dataIndex: 'count', key: 'count'}
];

export default class InterfaceManage extends Component {
  constructor(props) {
    super(props);
    this.initData = (v) => {
      let ret = {
        table: []
      };
      v && v.forEach(
        (item, index) => {
          ret.table.push({
            api_path: item.api_path,
            qps_max: item.qps_max,
            request_time_avg: item.request_time_avg,
            count: item.count,
            raw_sql: item.ral_log.group,
            sql_group: item.ral_log.sql_group,
            ral_chain: item.ral_chain,
            key: index
          });
        }
      );
      return ret;
    };
    this.state = {
      checked: true
    };
    this.handelChange = () => {
      this.setState({
        checked: !this.state.checked
      });
      !this.state.checked ? this.props.fetchGetNormal() : this.props.fetchGetAbnormal();
    };
  }
  componentWillMount() {
    this.props.fetchGetNormal();
    this.cache = lazyCache(this, {
      allData: {
        params: ['data'],
        fn: this.initData
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
  }
  render() {
    return (
      <div style={{margin: '0 30px'}}>
        <Switch style={{margin: '15px 0'}} checkedChildren={'正常'} unCheckedChildren={'异常'} checked={this.state.checked} onChange={this.handelChange} />
        <Table
          bordered
          size='middle'
          columns={columns}
          expandedRowRender={record =>
            <div>
              <TimingChart data={record.ral_chain} />
              <GroupList data={record.raw_sql} />
              <SQLList data={record.sql_group} />
            </div>
        }
          dataSource={this.cache.allData.table}
        />
      </div>
    );
  }
}

InterfaceManage.propTypes = {
};
InterfaceManage.defaultProps = {
  data: window._INITDATA_
};
