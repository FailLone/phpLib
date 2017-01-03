import React, {Component, PropTypes} from 'react';
import {Card, Icon, Select, Row, Col, DatePicker, message} from 'antd';
import './styles.scss';
import Dimensions from 'react-dimensions';
import IBDecorate from 'immutability';
import LazyLoad from 'react-lazy-load';
import {isString} from 'lodash';
import moment from 'moment';
const Option = Select.Option;
@IBDecorate
class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = () => {
      this.setState({
        fold: !this.getState('fold')
      });
    };
    this.handleChange = (e) => {
      let params;
      if (isString(e)) {
        params = {...this.props.params, hostname: e};
      } else if (moment.isMoment(e)) {
        params = {...this.props.params, date: e.format('YYYYMMDD')};
      } else {
        params = {...this.props.params, hour: e};
      }
      this.props.setParams(params);
      if (params.hour && params.date && params.hostname) {
      //   message.warning('Hours is necessary');
      // } else if (!params.date) {
      //   message.warning('Date is necessary');
      // } else if (!params.hostname) {
      //   message.warning('Hostnames is necessary');
      // } else {
        this.props.search(params);
      }
    };
  }
  state = {
    fold: true
  };
  componentWillMount() {
    this.props.action && this.props.action();
  }
  render() {
    return (
      <LazyLoad offsetTop={0} throttle={100}>
        <Card
          bordered={false}
          style={{height: this.getState('fold') ? '150px' : '80px'}}
          extra={<Icon onClick={this.handleClick} type={this.getState('fold') ? 'folder-open' : 'folder'} className='smaller' />}
          className={'animated ' + (this.getState('fold') ? 'slideLessRight' : 'slideLessLeft')}
        >
          <h2 className='graph-title'><Icon className='smaller' type='rocket' />{'Toolbar'}</h2>
          <div className={'toolbar-search animated ' + (this.getState('fold') ? 'slideInLeft' : 'slideOutLeft')}>
            <Row type='flex' align='center' justify='middle' >
              <Col span={4}>
                <b>{'Hours'}</b>
                <Select
                  placeholder='Search'
                  optionFilterProp='children'
                  onChange={this.handleChange}
                  size='large'
                  style={{width: '200px'}}
                  showSearch
                  value={this.props.params.hour}
                >
                  {
              this.props.config && this.props.config.errno === 0 ? this.props.config.data.hours.map(
                (v, index) => <Option value={v} key={index} >{v}</Option>
              ) : null
            }
                </Select>
              </Col>
              <Col span={2} />
              <Col span={4}>
                <b>{'Date'}</b>
                <DatePicker
                  onChange={this.handleChange}
                  size={'large'}
                  style={{width: '200px'}}
                  value={this.props.params.date ? moment(this.props.params.date) : null}
                />
              </Col>
              <Col span={2} />
              <Col span={10}>
                <b>{'Hostnames'}</b>
                <Select
                  placeholder='Search'
                  optionFilterProp='children'
                  onChange={this.handleChange}
                  size='large'
                  style={{width: '400px'}}
                  value={this.props.params.hostname}
                  showSearch
                >
                  {
              this.props.config && this.props.config.errno === 0 ? this.props.config.data.hostnames.map(
                (v, index) => <Option value={v} key={index} >{v.replace(' ', '')}</Option>
              ) : null
            }
                </Select>

              </Col>
            </Row>
          </div>
        </Card>
      </LazyLoad>
    );
  }
}

ToolBar.propTypes = {
  containerWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  containerHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Dimensions({
  containerStyle: {
    width: '98%',
    height: 'auto',
    marginLeft: '1%',
    marginRight: '1%'
  },
  elementResize: false
})(ToolBar);
