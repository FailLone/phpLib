import React, {Component, PropTypes} from 'react';
import { Table, Card, Icon } from 'antd';
import IBDecorate from 'immutability';
import Dimensions from 'react-dimensions';
import {map} from 'lodash';
import { findDOMNode } from 'react-dom';


// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入图
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/graphic');


@IBDecorate
class GroupList extends Component {
  constructor(props) {
    super(props);
    this.handleClick = () => {
      this.setState({
        fold: !this.getState('fold')
      });
    };
    this.initPie = () => {
      if (this.Pie) {
        this.myGraph = echarts.init(findDOMNode(this.Pie));
        this.myGraph.setOption(this.initOption(this.props.data));
        this.myGraph.resize({width: this.props.containerWidth * 0.95});
      }
    };
    this.initOption = (data) => {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: 'ChainGroup',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: map(data, (value, key) => ({
              value,
              name: key
            })),
            labelLine: {
              normal: {
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    };
  }
  state = {
    fold: true
  };
  componentDidUpdate() {
    this.initPie();
  }
  render() {
    return (
      <Card
        bordered={false}
        style={{ height: this.getState('fold') ? 'auto' : '80px' }}
        extra={<Icon onClick={this.handleClick} type={this.getState('fold') ? 'folder-open' : 'folder'} className='smaller' />}
        className={'animated ' + (this.getState('fold') ? 'slideLessRight' : 'slideLessLeft')}
      >
        <span className='graph-title'><Icon className='smaller' type='pie-chart' />{'Group'}</span>
        <div className='graph' ref={(c) => { this.Pie = c; }} style={{width: '95%', height: this.getState('fold') ? '200px' : '80px'}} />
      </Card>
    );
  }
}

GroupList.propTypes = {

};

export default Dimensions({
  containerStyle: {
    width: '98%',
    height: 'auto',
    marginLeft: '1%',
    marginRight: '1%'
  },
  elementResize: false
})(GroupList);
