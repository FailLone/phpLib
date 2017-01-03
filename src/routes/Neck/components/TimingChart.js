import React, { Component, PropTypes } from 'react';
import './styles.scss';
import { Card, Icon, Spin, Modal, Table } from 'antd';
import Dimensions from 'react-dimensions';
import IBDecorate from 'immutability';
import { findDOMNode } from 'react-dom';
import lazyCache from 'react-lazy-cache';
import { map, keys, findIndex, flattenDeep, uniqBy, size } from 'lodash';
import LazyLoad from 'react-lazy-load';

// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/axis');


@IBDecorate
class Graph extends Component {
  constructor(props) {
    super(props);
    this.handleClick = () => {
      this.setState({
        fold: !this.getState('fold')
      });
    };
    this.initOption = (data) => {
      // let categories_L = uniqBy(flattenDeep(map(data, (value) => {
      //   return map(value.ral_log.group, (v, k) => ({
      //     name: k,
      //     icon: 'circle'
      //   }));
      // })), 'name');
      // let ret = {};
      // for (let i = 0; i < categories_L.length; i++) {
      //   ret[i.name] = map(data, (item) => item.ral_log.group[i.name] || 0);
      // }
      let values = {};
      let index = 0;
      let initialStartTime = 0;
      values.empty = map(data, (value, key) => {
        let ret = new Array(size(data));
        ret[index] = value.cost;
        if (index === 0) {
          initialStartTime = value.req_start_time;
        }
        values[key] = ret;
        index++;
        return (value.req_start_time - initialStartTime) * 1000;
      });
      let categories_S = [];
      categories_S = map(data, (value, key) => ({
        name: Math.random(),
        type: 'bar',
        stack: '总量',
        barWidth: '10px',
        label: {
          normal: {
            show: true,
            position: 'right'
          }
        },
        data: values[key]
      }));
      categories_S.unshift({
        name: '辅助',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          },
          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)'
          }
        },
        data: values.empty
      });
      return {
        tooltip: {
          show: false
        },
        // legend: {
        //   data: categories_L,
        //   formatter: function(name) {
        //     return echarts.format.truncateText(name.replace('/logistics', ''), 40, '14px Microsoft Yahei', '…');
        //   },
        //   tooltip: {
        //     show: true
        //   },
        //   height: '10%'
        // },
        series: categories_S,
        color: ['#4f19c7', '#c71969', '#c71919', '#1984c7', '#c76919', '#8419c7', '#c79f19', '#c78419', '#c719b9', '#199fc7', '#9f19c7', '#69c719', '#19c719', '#1919c7', '#c74f19', '#19c7b9', '#9fc719', '#c7b919', '#b9c719', '#3419c7', '#19b9c7', '#34c719', '#19c784', '#c7199f', '#1969c7', '#c71984', '#1934c7', '#84c719', '#194fc7', '#c7194f', '#19c74f', '#b919c7', '#19c769', '#19c79f', '#4fc719', '#c73419', '#19c734', '#6919c7', '#c71934'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'category',
          splitLine: {show: false},
          data: map(data, value => value.service),
          axisLine: {
            show: false
          },
          inverse: true
        },
        xAxis: {
          type: 'value'
        }
      };
    };
    this.initGraph = () => {
      if (this.graph) {
        this.myGraph = echarts.init(findDOMNode(this.graph));
        this.myGraph.setOption(this.initOption(this.props.data));
        this.myGraph.resize({width: this.props.containerWidth * 0.95});
        this.myGraph.on('click', (e) => {
          let valueMapping = [];
          if (e.componentSubType === 'bar') {
            let index = 0;
            map(this.props.data, value => {
              valueMapping[index] = value;
              index++;
            });
            Modal.info({
              title: 'Detail',
              content: (<Table
                size='middle'
                showHeader={false}
                columns={[
                  { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
                  { title: 'Count', dataIndex: 'count', key: 'count' }
                ]}
                dataSource={map(valueMapping[e.seriesIndex], (value, key) => ({
                  name: key,
                  count: value
                }))}
                className='table'
                style={{marginTop: '30px'}}
                pagination={false}
                        />),
              width: 800,
              onOk() {}
            });
          }
        });
      }
    };
  }
  state = {
    fold: true
  };
  componentWillMount() {
    // this.cache = lazyCache(this, {
    //   option: {
    //     params: ['data'],
    //     fn: this.initOption
    //   }
    // });
  }
  componentDidUpdate() {
    this.initGraph();
  }
    // componentDidMount() {
    //     this.myGraph = echarts.init(findDOMNode(this.graph));
    //     this.myGraph.setOption(this.cache.option);
    //     this.myGraph.on('click', () => {
    //         let newOption = this.initOption(this.props.data);
    //         this.myGraph.setOption(newOption);
    //     });
    // }
  render() {
    console.log(this.props.data);
    return (
      <LazyLoad offsetTop={0} throttle={100} onContentVisible={this.initGraph} debounce={false}>
        <Card
          bordered={false}
          style={{ height: this.getState('fold') ? 'auto' : '80px' }}
          extra={<Icon onClick={this.handleClick} type={this.getState('fold') ? 'folder-open' : 'folder'} className='smaller' />}
          className={'animated ' + (this.getState('fold') ? 'slideLessRight' : 'slideLessLeft')}
        >
          <span className='graph-title'><Icon className='smaller' type='bar-chart' />{'Time'}</span>
          <Spin spinning={this.props.loading} >
            <div className='graph' ref={(c) => { this.graph = c; }} style={{width: '95%', height: this.getState('fold') ? '500px' : '80px'}} />
          </Spin>
        </Card>
      </ LazyLoad>
    );
  }
}

Graph.propTypes = {
  containerWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  containerHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.object.isRequired
};


export default Dimensions({
  containerStyle: {
    width: '98%',
    height: 'auto',
    marginLeft: '1%',
    marginRight: '1%'
  },
  elementResize: false
})(Graph);
