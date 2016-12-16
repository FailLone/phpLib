import React, { Component, PropTypes } from 'react';
import './styles.scss';
import { Card, Icon } from 'antd';
import Dimensions from 'react-dimensions';
import IBDecorate from 'immutability';
import { findDOMNode } from 'react-dom';
import lazyCache from 'react-lazy-cache';
import LazyLoad from 'react-lazy-load';
import { map, flattenDeep, uniqBy, cloneDeep } from 'lodash';

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
class Pie extends Component {
  constructor(props) {
    super(props);
    this.handleClick = () => {
      this.setState({
        fold: !this.getState('fold')
      });
    };
        // this.getRadius = (count, width) => {
        //     let dis = 30;
        //     let maxWid = 10;
        //     let radius = count > maxWid ? (width * 0.94 - dis) / (maxWid - 1) - dis : (width * 0.94 - dis) / (count - 1) - dis;
        //     return radius;
        // };
        // this.getLocationSize = (count, width) => {
        //     let num = count;
        //     let dis = 30;
        //     let maxWid = 10;
        //     let result = [];
        //     let radius = this.getRadius(count, width);
        //     for (let i = 0; i < Math.ceil(count / maxWid); i++) {
        //         let ret = num;
        //         if (num > maxWid) {
        //             ret = maxWid;
        //         }
        //         for (let j = 0; j < ret; j++) {
        //             result.push({
        //                 radius: radius / 2,
        //                 x: (dis + radius / 2) * (j + 1) + (radius / 2) * j,
        //                 y: (0.005 * width + radius) * (i + 1)
        //             });
        //         }
        //         num -= maxWid;
        //     }
        //     return result;
        // };
    this.getSeries = (data) => {
      let index = -1;
      let categories_S = map(data, (v, k) => {
        index > 1 ? index = 0 : index++;
        return {
          type: 'pie',
          name: k,
          data: map(v.group, (_v, _k) => ({
            name: _k,
            value: _v
          })),
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '10',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        };
      });
      return categories_S;
    };
    this.getLegend = (data) => {
      let categories_L = uniqBy(flattenDeep(map(data, (value) => {
        return map(value.data, (v) => ({
          name: v.name,
          icon: 'circle'
        }));
      })), 'name');
      return {
        data: categories_L,
        height: '10%'
      };
    };
    this.getGraphic = (data) => {
      let id = ['left', 'center', 'right'];
      let index = 0;
      return map(data, (item) => ({
        id: id[index++],
        type: 'text',
        $action: 'replace',
        top: '80%',
        left: item.center[0].replace('%', '') - item.radius.replace('%', '') / 5 + '%',
        z: 10,
        style: {
          text: item.name,
          font: 'bolder ' + (item.radius === '50%' ? '15px ' : '10px ') + '"Microsoft YaHei", sans-serif'
        }
      }));
    };
    this.initOption = (series, legend, graphic) => {
      return {
        title: {
          text: 'Inclusion Pie',
          subtext: 'Default layout',
          top: 'bottom',
          left: 'right'
        },
        tooltip: {},
        series: series,
        legend: legend,
        graphic: graphic
      };
    };
    this.initPie = () => {
      if (this.Pie) {
        let series = cloneDeep(this.cache.series);
        this.myPie = echarts.init(findDOMNode(this.Pie));
        let current = series.slice(0, 2);
        let location = [{
          radius: 50,
          x: 50,
          y: 50
        }, {
          radius: 25,
          x: 15,
          y: 50
        }, {
          radius: 25,
          x: 85,
          y: 50
        }];
        current[0] = {
          ...current[0],
          radius: location[0].radius + '%',
          center: [location[0].x + '%', location[0].y + '%']
        };
        current[1] = {
          ...current[1],
          radius: location[2].radius + '%',
          center: [location[2].x + '%', location[2].y + '%']
        };
        this.option = this.initOption(current, this.getLegend(current), this.getGraphic(current));
        this.myPie.setOption(this.option);
        this.myPie.resize({width: this.props.containerWidth * 0.95});
        this.currentIndex = -1;
        this.seriesIndex = 0;
        let self = this;
        this.times = 0;
        this.interval = setInterval(function() {
          self.times++;
          if (self.times >= (self.option.series[1].data ? self.option.series[1].data.length : 0)) {
            if (series.length <= 0) {
              series = cloneDeep(self.cache.series);
            }
            series.shift();
            current = series.slice(0, 3);
            current[0] = {
              ...current[0],
              radius: location[1].radius + '%',
              center: [location[1].x + '%', location[1].y + '%']
            };
            current[1] = {
              ...current[1],
              radius: location[0].radius + '%',
              center: [location[0].x + '%', location[0].y + '%']
            };
            current[2] = {
              ...current[2],
              radius: location[2].radius + '%',
              center: [location[2].x + '%', location[2].y + '%']
            };
            self.option = self.initOption(current, self.getLegend(current), self.getGraphic(current));
            self.myPie.setOption(self.option);
            self.times = 0;
            self.seriesIndex = 1;
          }
          let dataLen = self.option.series[self.seriesIndex].data ? self.option.series[self.seriesIndex].data.length : 0;
                    // 取消之前高亮的图形
          self.myPie.dispatchAction({
            type: 'downplay',
            seriesName: self.option.series[self.seriesIndex].name,
            dataIndex: self.currentIndex
          });
          self.currentIndex = isNaN((self.currentIndex + 1) % dataLen) ? 0 : (self.currentIndex + 1) % dataLen;
                    // 高亮当前图形
          self.myPie.dispatchAction({
            type: 'highlight',
            seriesName: self.option.series[self.seriesIndex].name,
            dataIndex: self.currentIndex
          });
        }, 1000);
      }
    };
    this.state = {
      fold: true,
      height: 500
            // height: (Math.ceil(size(this.props.data) / 10) + 1) * (0.005 * this.props.containerWidth + this.getRadius(size(this.props.data), this.props.containerWidth))
    };
  }
  componentWillMount() {
    this.cache = lazyCache(this, {
      series: {
        params: ['data'],
        fn: this.getSeries
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.cache.componentWillReceiveProps(nextProps);
        // this.setState({
        //     height: (Math.ceil(size(nextProps.data) / 10) + 1) * (0.005 * nextProps.containerWidth + this.getRadius(size(nextProps.data), nextProps.containerWidth))
        // });
  }
  componentDidUpdate() {
    this.initPie();
  }
  render() {
    return (
      <LazyLoad offsetTop={0} throttle={100} onContentVisible={this.initPie} debounce={false}>
        <Card
          bordered={false}
          style={{ height: this.getState('fold') ? this.getState('height') + 100 + 'px' : '80px' }}
          extra={<Icon onClick={this.handleClick} type={this.getState('fold') ? 'folder-open' : 'folder'} className='smaller' />}
          className={'animated ' + (this.getState('fold') ? 'slideLessRight' : 'slideLessLeft')}
        >
          <h2 className='graph-title'><Icon className='smaller' type='pie-chart' />{'Pie'}</h2>
          <div className='graph' ref={(c) => { this.Pie = c; }} style={{width: '95%', height: this.getState('fold') ? this.getState('height') + 'px' : '80px'}} />
        </Card>
      </LazyLoad>
    );
  }
}

Pie.propTypes = {
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
})(Pie);
