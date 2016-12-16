import React, {Component, PropTypes} from 'react';
import {Card, Icon, Input} from 'antd';
import './styles.scss';
import Dimensions from 'react-dimensions';
import IBDecorate from 'immutability';
import LazyLoad from 'react-lazy-load';


const Search = Input.Search;

@IBDecorate
class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = () => {
      this.setState({
        fold: !this.getState('fold')
      });
    };
  }
  state = {
    fold: true
  };
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
            <Search placeholder='Search' onSearch={this.props.onSearch} />
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
