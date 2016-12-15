import React, { Component, PropTypes } from 'react';
import './styles.scss';
import { Card, Icon } from 'antd';
import Dimensions from 'react-dimensions';
import IBDecorate from 'immutability';
import { findDOMNode } from 'react-dom';
import lazyCache from 'react-lazy-cache';
import LazyLoad from 'react-lazy-load';
import { map, size, flattenDeep, uniqBy } from 'lodash';

// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入图
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');


@IBDecorate
class Pie extends Component {
    constructor(props) {
        super(props);
        this.handleClick = () => {
            this.setState({
                fold: !this.getState('fold')
            });
        };
        this.getRadius = (count, width) => {
            let dis = 30;
            let maxWid = 10;
            let radius = count > maxWid ? (width * 0.94 - dis) / (maxWid - 1) - dis : (width * 0.94 - dis) / (count - 1) - dis;
            return radius;
        };
        this.getLocationSize = (count, width) => {
            let num = count;
            let dis = 30;
            let maxWid = 10;
            let result = [];
            let radius = this.getRadius(count, width);
            for (let i = 0; i < Math.ceil(count / maxWid); i++) {
                let ret = num;
                if (num > maxWid) {
                    ret = maxWid;
                }
                for (let j = 0; j < ret; j++) {
                    result.push({
                        radius: radius / 2,
                        x: (dis + radius / 2) * (j + 1) + (radius / 2) * j,
                        y: (0.005 * width + radius) * (i + 1)
                    });
                }
                num -= maxWid;
            }
            return result;
        };
        this.initOption = (data, width) => {
            let location = this.getLocationSize(size(data), width);
            let index = -1;
            let categories_S = map(data, (v, k) => {
                index++;
                return {
                    type: 'pie',
                    name: k,
                    data: map(v.group, (_v, _k) => ({
                        name: _k,
                        value: _v
                    })),
                    radius: location[index].radius + 'px',
                    center: [location[index].x + 'px', location[index].y + 'px'],
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
            let categories_L = uniqBy(flattenDeep(map(data, (value) => {
                return map(value.group, (v, k) => ({
                    name: k,
                    icon: 'circle'
                }));
            })), 'name');
            return {
                title: {
                    text: 'Inclusion Pie',
                    subtext: 'Default layout',
                    top: 'bottom',
                    left: 'right'
                },
                tooltip: {},
                series: categories_S,
                legend: {
                    data: categories_L,
                    formatter: function(name) {
                        return echarts.format.truncateText(name.replace('/logistics', ''), 40, '14px Microsoft Yahei', '…');
                    },
                    tooltip: {
                        show: true
                    },
                    height: '10%'
                }
            };
        };
        this.initPie = () => {
            if (this.Pie) {
                this.myPie = echarts.init(findDOMNode(this.Pie));
                this.myPie.setOption(this.initOption(this.props.data, this.props.containerWidth));
                this.myPie.resize({width: this.props.containerWidth * 0.95});
                this.currentIndex = -1;
                this.seriesIndex = 0;
                let self = this;
                this.interval = setInterval(function() {
                    let dataLen = self.cache.option.series[0].data.length;
                    // 取消之前高亮的图形
                    self.myPie.dispatchAction({
                        type: 'downplay',
                        seriesIndex: self.seriesIndex,
                        dataIndex: self.currentIndex
                    });
                    self.currentIndex = (self.currentIndex + 1) % dataLen;
                    // 高亮当前图形
                    self.myPie.dispatchAction({
                        type: 'highlight',
                        seriesIndex: self.seriesIndex,
                        dataIndex: self.currentIndex
                    });
                    // 显示 tooltip
                    self.myPie.dispatchAction({
                        type: 'showTip',
                        seriesIndex: self.seriesIndex,
                        dataIndex: self.currentIndex
                    });
                }, 1000);
                this.myPie.on('click', (params) => {
                    clearInterval(this.interval);
                    let self = this;
                    self.myPie.dispatchAction({
                        type: 'downplay',
                        seriesIndex: self.seriesIndex,
                        dataIndex: self.currentIndex
                    });
                    self.currentIndex = -1;
                    self.interval = setInterval(function() {
                        self.seriesIndex = params.seriesIndex;
                        let dataLen = self.cache.option.series[params.seriesIndex].data.length;
            // 取消之前高亮的图形
                        self.myPie.dispatchAction({
                            type: 'downplay',
                            seriesIndex: params.seriesIndex,
                            dataIndex: self.currentIndex
                        });
                        self.currentIndex = (self.currentIndex + 1) % dataLen;
            // 高亮当前图形
                        self.myPie.dispatchAction({
                            type: 'highlight',
                            seriesIndex: params.seriesIndex,
                            dataIndex: self.currentIndex
                        });
            // 显示 tooltip
                        self.myPie.dispatchAction({
                            type: 'showTip',
                            seriesIndex: params.seriesIndex,
                            dataIndex: self.currentIndex
                        });
                    }, 1000);
                });
            }
        };
        this.state = {
            fold: true,
            height: (Math.ceil(size(this.props.data) / 10) + 1) * (0.005 * this.props.containerWidth + this.getRadius(size(this.props.data), this.props.containerWidth))
        };
    }
    componentWillMount() {
        this.cache = lazyCache(this, {
            option: {
                params: ['data', 'containerWidth'],
                fn: this.initOption
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        this.cache.componentWillReceiveProps(nextProps);
        this.setState({
            height: (Math.ceil(size(nextProps.data) / 10) + 1) * (0.005 * nextProps.containerWidth + this.getRadius(size(nextProps.data), nextProps.containerWidth))
        });
    }
    componentDidUpdate() {
        if (this.myPie) {
            this.myPie.resize();
            this.myPie.setOption(this.cache.option);
        }
    }
    render() {
        return (
          <LazyLoad offsetTop={0} throttle={0} onContentVisible={this.initPie} >
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
