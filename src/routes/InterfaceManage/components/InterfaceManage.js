import React, {Component} from 'react';
import { Table, Icon } from 'antd';
import TimingChart from './TimingChart';
import GroupList from './GroupList';
import SQLList from './SQLList';
import {mapValues} from 'lodash';
import lazyCache from 'react-lazy-cache';

const columns = [
  { title: '接口名称', dataIndex: 'name', key: 'name' },
  { title: 'QPS', dataIndex: 'age', key: 'age' },
  { title: '响应时间', dataIndex: 'address', key: 'address' },
  { title: '调用次数', dataIndex: '', key: 'x', render: () => <a href='#'>Delete</a> }
];

const data = [
  { key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
  { key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
  { key: 3, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.', group: {'mysql@logistics_order/waimai_nj': 5, 'mysql@logistics_list': 5, 'mysql@logistics_frontend': 5} }
];
export default class InterfaceManage extends Component {
  constructor(props) {
    super(props);
    this.initData = (data) => {
      let ret = {};
      ret.graph = mapValues(data, o => ({
        group: o.ral_log ? o.ral_log.group : {},
        count: o.ral_count_max
      }));
      return ret;
    };
  }
  componentWillMount() {
    this.cache = lazyCache(this, {
      data: {
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
        <Table
          bordered
          size='middle'
          columns={columns}
          expandedRowRender={record =>
            <div>
              <TimingChart data={this.cache.data.graph} />
              <GroupList data={this.cache.data.graph.group || [{name: 'mysql@logistics_order/waimai_nj', times: 5}, {name: 'mysql@logistics_list', times: 5}, {name: 'mysql@logistics_frontend', times: 5}]} />
              {// <SQLList />}
          }
            </div>
        }
          dataSource={data}
          className='table'
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
